import { useState } from "react";
import { useAuth } from "../../../lib/authContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { Sparkles, LogIn } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success("Login berhasil! 🎉");
      // Redirect will be handled by App.tsx
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Login gagal, silahkan coba lagi"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-purple-700" />
            <h1 className="text-4xl font-bold">Idea Board</h1>
          </div>
          <p className="text-gray-600">Kelola ide Anda dengan lebih baik</p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white/90 rounded-3xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="mt-2"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="mt-2"
              />
            </div>

            {/* LOGIN BUTTON */}
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full text-lg py-6 mt-6"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? "Sedang Login..." : "Login"}
            </Button>
          </form>

          {/* INFO */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
            <strong>Demo Mode:</strong> Gunakan email dan password apapun untuk login
          </div>
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-600 text-sm mt-6">
          © 2024 Idea Management Board
        </p>
      </div>
    </div>
  );
};

export default LoginPage;