import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Input } from "../components/ui/Form";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Droplets } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(username, password)) {
            navigate(from, { replace: true });
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <Card className="w-full max-w-sm bg-white shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-600 p-3 rounded-xl text-white">
                            <Droplets className="w-8 h-8" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
                    <p className="text-slate-500 text-sm">Sign in to Baqalye System</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Username</label>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter 'admin'"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter 'admin'"
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        <Button type="submit" className="w-full">Sign In</Button>

                        <div className="text-center text-xs text-slate-400 mt-4">
                            Default credentials: admin / admin
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
