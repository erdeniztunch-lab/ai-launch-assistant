import './globals.css'

export const metadata = {
    title: 'LaunchFast AI',
    description: 'AI launch motor for startups',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}