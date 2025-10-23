import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface FeedbackDialogProps {
  open: boolean;
  rating: number;
  onClose: () => void;
  onSubmit: (selectedIssues: string[], detailedMessage: string) => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

const COMMON_ISSUES = [
  "Analysis wasn't accurate",
  "Missing important information",
  "Difficult to understand",
  "Product wasn't found in database",
  "Too slow/technical issues",
  "Other",
];

const FeedbackDialog = ({
  open,
  rating,
  onClose,
  onSubmit,
  onSkip,
  isSubmitting,
}: FeedbackDialogProps) => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [detailedMessage, setDetailedMessage] = useState("");

  const getMessage = () => {
    if (rating <= 2) {
      return "We're really sorry to hear that 😔 Your feedback is crucial to help us improve.";
    }
    return "Thanks for your rating! We'd love to know what could have made this a 5-star experience.";
  };

  const handleToggleIssue = (issue: string) => {
    setSelectedIssues((prev) =>
      prev.includes(issue)
        ? prev.filter((i) => i !== issue)
        : [...prev, issue]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedIssues, detailedMessage);
    // Reset state
    setSelectedIssues([]);
    setDetailedMessage("");
  };

  const handleSkip = () => {
    onSkip();
    // Reset state
    setSelectedIssues([]);
    setDetailedMessage("");
  };

  const isSubmitDisabled = selectedIssues.length === 0 && !detailedMessage.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Help Us Improve</DialogTitle>
          <DialogDescription>{getMessage()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              What went wrong? (Select all that apply)
            </Label>
            <div className="space-y-2">
              {COMMON_ISSUES.map((issue) => (
                <div key={issue} className="flex items-center space-x-2">
                  <Checkbox
                    id={issue}
                    checked={selectedIssues.includes(issue)}
                    onCheckedChange={() => handleToggleIssue(issue)}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor={issue}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {issue}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-sm font-medium">
              Additional details (Optional)
            </Label>
            <Textarea
              id="details"
              placeholder="Tell us more about your experience..."
              value={detailedMessage}
              onChange={(e) => setDetailedMessage(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            💡 Your detailed feedback helps us improve for everyone. We're considering rewards for top contributors!
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isSubmitDisabled}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
