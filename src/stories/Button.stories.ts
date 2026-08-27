import type { Meta, StoryObj } from '@storybook/vue3';
import { Button } from '@/shared/ui';

const meta = {
  title: 'Design System/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon']
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Primary Action</Button>'
  })
};

export const Secondary: Story = {
  args: {
    variant: 'secondary'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Secondary Action</Button>'
  })
};

export const Destructive: Story = {
  args: {
    variant: 'destructive'
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Delete Record</Button>'
  })
};

export const Loading: Story = {
  args: {
    loading: true
  },
  render: args => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Processing...</Button>'
  })
};
