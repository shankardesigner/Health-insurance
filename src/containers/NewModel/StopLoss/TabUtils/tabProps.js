export function a11yProps(index) {
  return {
    id: `nemo-tab-${index}`,
    "aria-controls": `nemo-tabpanel-${index}`,
  };
}