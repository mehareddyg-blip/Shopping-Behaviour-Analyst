'use client';
import {useState, useEffect, Fragment} from "react";
import Markdown from "react-markdown";

export default function Products() {

  type Product = {
    id: number;
    description: string;
    price: number;
    shippingDays: number;
    category: string;
  }

  type CartItem = {
    product: Product;
    quantity: number;
  }

  const [products, setProduct] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hours, setHours] = useState(2);
  const [summary, setSummary] = useState('Not Yet Generated');
  const [events, setEvents] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const addToCart = (product: Product) => {
    setCart(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        if (existing) {
            return prev.map(item =>
                item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        }
        return [...prev, { product, quantity: 1 }];
    });

    fetch('http://localhost:8080/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            eventId: Date.now(),
            timestamp: new Date().toISOString(),
            type: 'CLICK',
            productId: product.id,
            timeSpent: 0.00
        })
    })
    .then(() => setRefresh(r => r + 1))
    .catch((e) => console.log(e))
  }

  const removeFromCart = (id: number) => {
    setCart(prev => {
        const existing = prev.find(item => item.product.id === id);
        if (existing && existing.quantity > 1) {
            return prev.map(item =>
                item.product.id === id
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
        }
        return prev.filter(item => item.product.id !== id);
    });
  };

  const categories = [
    { name: 'Accessories', color: 'bg-blue-100' },
    { name: 'Toys', color: 'bg-blue-100' },
    { name: 'Clothes', color: 'bg-blue-100' },
  ]

  useEffect(() => {
    fetch(`http://localhost:8080/product?filter=${search}`)
        .then(res => res.json())
        .then(data => setProduct(Array.isArray(data) ? data : [data]))
        .catch((e) => console.log(e))
  }, [search])

  useEffect(() => {
    fetch(`http://localhost:8080/events?hours=${hours}`)
        .then(res => res.json())
        .then(data => setEvents(data))
        .catch((e) => console.log(e))
  }, [hours, refresh])

  const totalSpent = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const purchasedCategories = [
    ...new Set(cart.map(item => item.product.category))
  ];

  const generateSummary = () => {
    fetch(`http://localhost:8080/events/summary?hours=${hours}`)
        .then(res => res.json())
        .then(data => {
            const clickHistory = data.map((row: any) =>
                `${row[0]} ${row[1]} $${row[2]}`
            ).join(', ');

            const message = `The user has clicked on these items in the past ${hours} hour${hours > 1 ? 's' : ''}: ${clickHistory}`;

            return fetch("http://localhost:1234/v1/chat/completions", {
                method: 'POST',
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    model: "gemma-2b-it",
                    messages: [
                        { role: "system", content: "You are a shopping analyzer. Analyze and generate shopping behaviour." },
                        { role: "user", content: message }
                    ]
                })
            })
        })
        .then(res => res.json())
        .then(data => setSummary(data.choices[0].message.content))
        .catch(e => console.log(e))
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-10 w-full">
        <span className="font-bold text-xl text-center">Products</span>
        <input
            className="ring-1 p-2 w-full max-w-lg self-center"
            value={search}
            placeholder="Search by description, price or shipping days"
            onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-6 items-start w-full">

            <div className="flex-shrink-0">
                <table>
                    <thead>
                        <tr className="bg-purple-300">
                            <th className="p-2">ID</th>
                            <th className="p-2">Description</th>
                            <th className="p-2">Price</th>
                            <th className="p-2">Shipping Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <Fragment key={cat.name}>
                                <tr className={cat.color}>
                                    <td colSpan={4} className="p-2 font-bold text-center">
                                        {cat.name}
                                    </td>
                                </tr>
                                {products.filter(p => p.category === cat.name).map((p) => (
                                    <tr key={p.id} onClick={() => addToCart(p)} className="border-b hover:bg-gray-300 cursor-pointer">
                                        <td className="p-2">{p.id}</td>
                                        <td className="p-2">{p.description}</td>
                                        <td className="p-2">${p.price}</td>
                                        <td className="p-2 text-center">{p.shippingDays}</td>
                                    </tr>
                                ))}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-4 w-64 flex-shrink-0">

                {/* Cart */}
                <div className="border p-4">
                    <h2 className="font-bold text-lg text-center">Cart</h2>
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm mt-2">Cart is empty</p>
                    ) : (
                        <ul>
                            {cart.map((item) => (
                                <li key={item.product.id} className="border-b p-2">
                                    <p className="text-sm">{item.product.description}</p>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-sm">${item.product.price}</p>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => removeFromCart(item.product.id)} className="text-sm px-1 border rounded">-</button>
                                            <span className="text-sm">{item.quantity}</span>
                                            <button onClick={() => addToCart(item.product)} className="text-sm px-1 border rounded">+</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Shopping Summary */}
                <div className="border p-4">
                    <h2 className="font-bold text-lg text-center">Shopping Summary</h2>

                    <p className="mt-3">
                        <strong>Total Money Spent:</strong><br />
                        ${totalSpent.toFixed(2)}
                    </p>

                    <p className="mt-3">
                        <strong>Categories Purchased:</strong><br />
                        {purchasedCategories.length > 0 ? purchasedCategories.join(", ") : "No products purchased"}
                    </p>

                    <p className="mt-3"><strong>Shopping Behaviour:</strong></p>
                    <div className="flex items-center gap-3 mt-1">
                        <button onClick={() => setHours(h => Math.max(1, h - 1))} className="border px-2 py-1 rounded">-</button>
                        <span className="text-sm">Last {hours} hour{hours > 1 ? 's' : ''}</span>
                        <button onClick={() => setHours(h => h + 1)} className="border px-2 py-1 rounded">+</button>
                    </div>
                    <button className="mt-2 px-3 py-1 bg-blue-300 rounded text-sm" onClick={generateSummary}>Generate</button>
                </div>

            </div>

            <div className="border p-4 flex-1 min-h-64">
                <h2 className="font-bold text-lg text-center mb-3">Analysis</h2>
                <div className="text-sm prose max-w-none">
                    <Markdown>{summary}</Markdown>
                </div>
            </div>

        </div>
    </div>
  );
}