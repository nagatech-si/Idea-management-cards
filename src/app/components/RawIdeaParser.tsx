import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Info } from "lucide-react";

interface RawIdeaParserProps {
  isOpen: boolean;
  onClose: () => void;
  onParse: (rawText: string) => void;
}

export function RawIdeaParser({ isOpen, onClose, onParse }: RawIdeaParserProps) {
  const [rawText, setRawText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rawText.trim()) {
      onParse(rawText);
      setRawText("");
      onClose();
    }
  };

  const exampleText = `22 Dec 2025
Pak Akiong
- Nava Embed ke Nagagold untuk AI support internal
- Automasi proses approval menggunakan workflow digital`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Konversi Ide Mentah ke Kartu Ide</DialogTitle>
          <DialogDescription>
            Paste hasil rapat atau brainstorming Anda untuk dikonversi menjadi kartu ide terstruktur.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Format yang disarankan:</p>
                <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
{exampleText}
                </pre>
                <p className="text-xs text-gray-600">
                  Paste hasil rapat/brainstorming Anda di bawah ini. Sistem akan membantu mengkonversinya menjadi kartu ide terstruktur.
                </p>
              </div>
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="rawText">Ide Mentah *</Label>
            <Textarea
              id="rawText"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={12}
              placeholder={exampleText}
              required
              className="font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Proses Ide</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}