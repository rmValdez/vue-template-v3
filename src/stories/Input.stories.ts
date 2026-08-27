import type { Meta, StoryObj } from '@storybook/vue3';
import { Input } from '@/shared/ui';

const meta = {
  title: 'Design System/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' }
  }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'user@company.com'
  },
  render: args => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<Input v-bind="args" />'
  })
};

export const WithError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    error: 'Password must be at least 8 characters'
  },
  render: args => ({
    components: { Input },
    setup() {
      return { args };
    },
    template: '<Input v-bind="args" />'
  })
};
