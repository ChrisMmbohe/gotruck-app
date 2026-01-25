/**
 * Profile Completion Tracker Component
 * Visual indicator of profile completion percentage
 */

'use client';

import { useMemo } from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfileCompletion } from '@/types/user';

interface ProfileCompletionTrackerProps {
  completion: ProfileCompletion;
  className?: string;
}


export function ProfileCompletionTracker({ completion, className }: ProfileCompletionTrackerProps) {
  if (!completion) {
    return (
      <div className={className}>
        <div className="rounded-lg border p-4 bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300">
          <p className="font-medium">Profile completion data unavailable.</p>
        </div>
      </div>
    );
  }
  const { percentage, completedFields, missingFields } = completion;

  // Determine status and color
  const status = useMemo(() => {
    if (percentage >= 100) return { label: 'Complete', color: 'bg-green-500', variant: 'default' as const };
    if (percentage >= 75) return { label: 'Almost There', color: 'bg-blue-500', variant: 'secondary' as const };
    if (percentage >= 50) return { label: 'In Progress', color: 'bg-yellow-500', variant: 'secondary' as const };
    return { label: 'Getting Started', color: 'bg-gray-500', variant: 'outline' as const };
  }, [percentage]);

  // Format field names for display
  const formatFieldName = (field: string): string => {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete your profile to unlock all features</CardDescription>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{percentage}% Complete</span>
            <span className="text-muted-foreground">
              {completedFields.length} of {completedFields.length + missingFields.length} fields
            </span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        {/* Completion Messages */}
        {percentage === 100 ? (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-950 dark:text-green-300">
            <CheckCircle2 className="h-5 w-5" />
            <p className="text-sm font-medium">
              🎉 Your profile is complete! You have access to all features.
            </p>
          </div>
        ) : percentage >= 75 ? (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-4 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">
              You're almost there! Just a few more fields to complete.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-4 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">
              Complete your profile to access all platform features.
            </p>
          </div>
        )}

        {/* Missing Fields */}
        {missingFields.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Required Fields</h4>
            <ul className="space-y-2">
              {missingFields.slice(0, 5).map((field) => (
                <li key={field} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Circle className="h-4 w-4" />
                  <span>{formatFieldName(field)}</span>
                </li>
              ))}
              {missingFields.length > 5 && (
                <li className="text-sm text-muted-foreground">
                  + {missingFields.length - 5} more fields
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Completed Fields Summary */}
        {completedFields.length > 0 && percentage < 100 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-green-600 dark:text-green-400">
              ✓ Completed ({completedFields.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {completedFields.slice(0, 8).map((field) => (
                <Badge key={field} variant="outline" className="text-xs">
                  <CheckCircle2 className="mr-1 h-3 w-3 text-green-600" />
                  {formatFieldName(field)}
                </Badge>
              ))}
              {completedFields.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{completedFields.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        {percentage < 100 && (
          <div className="space-y-2 rounded-lg border border-dashed p-4">
            <h4 className="text-sm font-semibold">Why complete your profile?</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Unlock premium features and tools</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Build trust with verified information</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                <span>Get better support and assistance</span>
              </li>
              {percentage < 75 && (
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                  <span>Access payment and billing features</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
