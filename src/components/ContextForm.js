'use client'

import { useState } from 'react'

export default function ContextForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        product: '',
        audience: '',
        artifact: 'idea',
        learningGoal: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div>
                <label className="block text-sm font-medium mb-2">
                    What is the product or idea? (1 sentence)
                </label>
                <input
                    type="text"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    placeholder="AI launch motor for startups..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Who is the first launch for?
                </label>
                <input
                    type="text"
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    placeholder="Solo founders with MVP ready..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Which artifact do you currently have?
                </label>
                <select
                    value={formData.artifact}
                    onChange={(e) => setFormData({ ...formData, artifact: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    <option value="idea">Just an idea</option>
                    <option value="landing">Landing page</option>
                    <option value="mvp">Demo / MVP</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    What do you want to learn from this launch?
                </label>
                <textarea
                    value={formData.learningGoal}
                    onChange={(e) => setFormData({ ...formData, learningGoal: e.target.value })}
                    placeholder="Do people understand the problem?"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
                Generate Launch Plan
            </button>
        </form>
    )
}