'use client'

import { useState } from 'react'
import ContextForm from '@/components/ContextForm'

export default function Home() {
    const [step, setStep] = useState('form') // form, hypothesis, launchType, task
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(null)
    const [hypothesis, setHypothesis] = useState(null)
    const [launchType, setLaunchType] = useState(null)
    const [task, setTask] = useState(null)

    // Step 1: Generate Hypothesis
    const handleFormSubmit = async (data) => {
        setFormData(data)
        setLoading(true)

        try {
            const response = await fetch('/api/generate-hypothesis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (response.ok) {
                setHypothesis(result)
                setStep('hypothesis')
            } else {
                alert('Error: ' + (result.error || 'Something went wrong'))
            }
        } catch (error) {
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    // Step 2: Select Launch Type
    const handleGenerateLaunchType = async () => {
        setLoading(true)

        try {
            const response = await fetch('/api/select-launch-type', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hypothesis: hypothesis.hypothesis,
                    artifact: formData.artifact
                })
            })

            const result = await response.json()

            if (response.ok) {
                setLaunchType(result)
                setStep('launchType')
            } else {
                alert('Error: ' + (result.error || 'Something went wrong'))
            }
        } catch (error) {
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    // Step 3: Generate Task
    const handleGenerateTask = async () => {
        setLoading(true)

        try {
            const response = await fetch('/api/generate-task', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hypothesis: hypothesis.hypothesis,
                    launchType: launchType.launch_type,
                    artifact: formData.artifact
                })
            })

            const result = await response.json()

            if (response.ok) {
                setTask(result)
                setStep('task')
            } else {
                alert('Error: ' + (result.error || 'Something went wrong'))
            }
        } catch (error) {
            alert('Error: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const resetFlow = () => {
        setStep('form')
        setFormData(null)
        setHypothesis(null)
        setLaunchType(null)
        setTask(null)
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        LaunchFast AI
                    </h1>
                    <p className="text-xl text-gray-600">
                        Launch is not a moment. It's a habit.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Ship your first GTM action in 3 minutes
                    </p>
                </div>

                {/* Step 1: Form */}
                {step === 'form' && !loading && <ContextForm onSubmit={handleFormSubmit} />}

                {/* Loading */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Thinking...</p>
                    </div>
                )}

                {/* Step 2: Hypothesis */}
                {step === 'hypothesis' && hypothesis && (
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Launch Hypothesis</h2>

                        <div className="space-y-6 mb-8">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Hypothesis</h3>
                                <p className="text-lg text-gray-900">{hypothesis.hypothesis}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Reasoning</h3>
                                <p className="text-gray-700">{hypothesis.reasoning}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Success Signal</h3>
                                <p className="text-gray-700">{hypothesis.success_signal}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleGenerateLaunchType}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                Continue → Select Launch Type
                            </button>
                            <button
                                onClick={resetFlow}
                                className="text-gray-600 hover:underline"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Launch Type */}
                {step === 'launchType' && launchType && (
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Launch Strategy</h2>

                        <div className="space-y-6 mb-8">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Launch Type</h3>
                                <p className="text-2xl font-bold text-blue-600">{launchType.launch_type}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Why This Type?</h3>
                                <p className="text-gray-700">{launchType.reason}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Preparation Needed</h3>
                                <p className="text-gray-700">{launchType.preparation_needed}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleGenerateTask}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                Continue → Get Your Task
                            </button>
                            <button
                                onClick={resetFlow}
                                className="text-gray-600 hover:underline"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Task */}
                {step === 'task' && task && (
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Your 30-Minute Task</h2>

                        <div className="space-y-6 mb-8">
                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                                <p className="text-xl font-bold text-gray-900">{task.task}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Instructions</h3>
                                <ol className="list-decimal list-inside space-y-2">
                                    {task.instructions.map((instruction, i) => (
                                        <li key={i} className="text-gray-700">{instruction}</li>
                                    ))}
                                </ol>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">⏱️ Timebox</h3>
                                    <p className="text-gray-700">{task.timebox}</p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-700 mb-2">🎯 Success Criteria</h3>
                                    <p className="text-gray-700">{task.success_criteria}</p>
                                </div>
                            </div>

                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">💡 Why This Matters</h3>
                                <p className="text-gray-700">{task.why_this_matters}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={resetFlow}
                                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
                            >
                                ✓ Got It! Start New Launch
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}