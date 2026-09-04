import type { Meta, StoryObj } from '@storybook/vue3';
import { Badge } from '@/shared/ui';

const meta = {
  title: 'Design System/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'outline',
        'destructive',
        'success',
        'warning'
      ]
    }
  }
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: 'default' },
  render: args => ({
    components: { Badge },
    setup() {
      return { args };
    },
    template: '<Badge v-bind="args">Default Badge</Badge>'
  })
};

export const Success: Story = {
  args: { variant: 'success' },
  render: args => ({
    components: { Badge },
    setup() {
      return { args };
    },
    template: '<Badge v-bind="args">Active Status</Badge>'
  })
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: args => ({
    components: { Badge },
    setup() {
      return { args };
    },
    template: '<Badge v-bind="args">Critical Error</Badge>'
  })
};
