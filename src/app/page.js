'use client';
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { Sun, Moon } from "lucide-react";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Call backend API
  async function handleAnalyze(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze fonts.");
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to analyze fonts.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <button
        aria-label="Toggle dark mode"
        onClick={toggleTheme}
        className="absolute top-4 right-4 rounded-full p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white shadow hover:bg-gray-100 dark:hover:bg-gray-900 transition"
        type="button"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Font Scout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
            <label htmlFor="url" className="font-medium">Website URL</label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              required
              disabled={loading}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}Analyze Fonts
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
      {loading && (
        <div className="mt-6 flex items-center gap-2 text-blue-600">
          <Loader2 className="animate-spin h-5 w-5" />
          Analyzing fonts...
        </div>
      )}
      {result && (
        <Card className="mt-8 w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Results for <span className="break-all text-blue-700">{result.analyzedUrl}</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h2 className="font-semibold mb-2">Font Families</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.fontFamilies.map(f => (
                    <TableRow key={f}>
                      <TableCell>{f}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <h2 className="font-semibold mb-2">Font Files</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.fontFiles.map(f => (
                    <TableRow key={f.url}>
                      <TableCell className="break-all text-blue-700 underline"><a href={f.url} target="_blank" rel="noopener noreferrer">{f.url}</a></TableCell>
                      <TableCell>{f.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
