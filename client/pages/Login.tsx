import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Eye, EyeOff, Loader2 } from "lucide-react";
import { SimplePawLogo } from "@/components/PetPawLogo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError(
          "Credenciales incorrectas. Por favor verifica tu email y contraseña.",
        );
      }
    } catch (error) {
      setError("Error al iniciar sesión. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: "admin@matispet.com", role: "Administrador", password: "123456" },
    { email: "vet@matispet.com", role: "Veterinario", password: "123456" },
    {
      email: "recepcion@matispet.com",
      role: "Recepcionista",
      password: "123456",
    },
    { email: "cajero@matispet.com", role: "Cajero", password: "123456" },
    { email: "groomer@matispet.com", role: "Groomer", password: "123456" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-vet-accent via-background to-vet-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Branding */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <SimplePawLogo className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-foreground">
                Matis Pet Groomer
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema de Gestión Veterinaria
              </p>
            </div>
          </Link>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede al sistema de gestión veterinaria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cuentas de Demostración</CardTitle>
            <CardDescription>
              Usa estas credenciales para probar el sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoAccounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
              >
                <div>
                  <p className="font-medium text-sm">{account.role}</p>
                  <p className="text-xs text-muted-foreground">
                    {account.email}
                  </p>
                </div>
                <Button variant="outline" size="sm" type="button">
                  Usar
                </Button>
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center pt-2">
              Contraseña para todas las cuentas:{" "}
              <code className="bg-muted px-1 rounded">123456</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
