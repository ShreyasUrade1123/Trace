import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <SignIn
                appearance={{
                    elements: {
                        formButtonPrimary:
                            "bg-purple-600 hover:bg-purple-700 text-sm normal-case",
                        card: "bg-gray-900 border border-gray-800",
                        headerTitle: "text-white",
                        headerSubtitle: "text-gray-400",
                        socialButtonsBlockButton:
                            "bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
                        socialButtonsBlockButtonText: "text-white",
                        formFieldLabel: "text-gray-300",
                        formFieldInput:
                            "bg-gray-800 border-gray-700 text-white placeholder-gray-500",
                        footerActionLink: "text-purple-400 hover:text-purple-300",
                    },
                }}
            />
        </div>
    );
}
