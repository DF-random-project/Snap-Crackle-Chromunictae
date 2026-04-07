import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { LogIn } from "lucide-react";
import { Footer } from "../components/Footer";

export function LoginPage() {
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);

	useEffect(() => {
		const err = new URLSearchParams(window.location.search).get("error");
		if (err) {
			if (err === "invalid_state") setErrorMsg("Session expired. Please try again.");
			else if (err === "server_error") setErrorMsg("An error occurred. Please try again.");
			else setErrorMsg(err);
		}
	}, []);

	const handleLogin = async () => {
		setLoading(true);
		try {
			const res = await fetch("/auth/login");
			const data = await res.json();
			if (data.url) {
				window.location.href = data.url;
			}
		} catch (e) {
			console.error("Failed to start login", e);
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-50/50 flex flex-col items-center justify-center p-4">
			<div className="max-w-sm w-full bg-white rounded-2xl shadow-sm border border-zinc-200/50 p-8 text-center space-y-8">
				<div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-inner">
					<span className="text-xl font-bold text-white tracking-tight">S</span>
				</div>
				
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
						Welcome to Sirsnap
					</h1>
					<p className="text-sm text-zinc-500">
						Please sign in with your Slack account to continue.
					</p>
				</div>

				{errorMsg && (
					<div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium text-left">
						{errorMsg}
					</div>
				)}

				<Button
					size="lg"
					className="w-full font-medium"
					onClick={handleLogin}
					disabled={loading}
				>
					{loading ? (
						"Redirecting to Slack..."
					) : (
						<>
							<LogIn className="w-4 h-4 mr-2" />
							Sign in with Slack
						</>
					)}
				</Button>
			</div>
			
			<div className="absolute bottom-0 left-0 w-full">
				<Footer />
			</div>
		</div>
	);
}
