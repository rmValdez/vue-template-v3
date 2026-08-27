import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '../Button.vue';

describe('Button Component', () => {
  it('renders slot content correctly', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click Me'
      }
    });
    expect(wrapper.text()).toContain('Click Me');
  });

  it('emits click event on button click', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Submit'
      }
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });

  it('disables button when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled Button'
      }
    });
    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('disables button and shows spinner when loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true
      },
      slots: {
        default: 'Loading...'
      }
    });
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.find('.animate-spin').exists()).toBe(true);
  });
});
