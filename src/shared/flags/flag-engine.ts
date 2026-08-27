import { ref } from 'vue';

export type FeatureFlagKey =
  | 'enableAnalyticsCharts'
  | 'enableNewPostEditor'
  | 'enableUserExport'
  | 'enableNotificationsDrawer';

const defaultFlags: Record<FeatureFlagKey, boolean> = {
  enableAnalyticsCharts: true,
  enableNewPostEditor: true,
  enableUserExport: false,
  enableNotificationsDrawer: true
};

const flagsState = ref<Record<FeatureFlagKey, boolean>>({ ...defaultFlags });

export function useFeatureFlags() {
  const isEnabled = (key: FeatureFlagKey): boolean => {
    return !!flagsState.value[key];
  };

  const setFlag = (key: FeatureFlagKey, enabled: boolean) => {
    flagsState.value[key] = enabled;
  };

  const resetFlags = () => {
    flagsState.value = { ...defaultFlags };
  };

  return {
    flags: flagsState,
    isEnabled,
    setFlag,
    resetFlags
  };
}
