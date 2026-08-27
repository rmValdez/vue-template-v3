import type { Meta, StoryObj } from '@storybook/vue3';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button
} from '@/shared/ui';

const meta = {
  title: 'Design System/Card',
  component: Card,
  tags: ['autodocs']
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => ({
    components: {
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      CardFooter,
      Button
    },
    template: `
      <Card class="max-w-sm">
        <CardHeader>
          <CardTitle>Enterprise Analytics</CardTitle>
          <CardDescription>Real-time metrics and cloud telemetry.</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-xs text-muted-foreground">Monitor cluster status, error budgets, and API latencies seamlessly.</p>
        </CardContent>
        <CardFooter class="flex justify-end gap-2">
          <Button variant="outline" size="sm">Dismiss</Button>
          <Button variant="primary" size="sm">View Metrics</Button>
        </CardFooter>
      </Card>
    `
  })
};
