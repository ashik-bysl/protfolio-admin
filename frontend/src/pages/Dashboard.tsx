import CssBaseline from "@mui/material/CssBaseline";
import DashboardLayout from "../components/DashboardLayout";
// import EmployeeShow from "../components/EmployeeShow";
// import EmployeeCreate from "../components/EmployeeCreate";
// import EmployeeEdit from "./components/EmployeeEdit";
import NotificationsProvider from "../providers/NotificationsProvider";
import DialogsProvider from "../providers/DialogsProvider";
import AppTheme from "../shared-theme/AppTheme";
import {
  dataGridCustomizations,
  datePickersCustomizations,
  sidebarCustomizations,
  formInputCustomizations,
} from "../shared-theme/customizations";

const themeComponents = {
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...sidebarCustomizations,
  ...formInputCustomizations,
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={themeComponents}>
      <CssBaseline enableColorScheme />
      <NotificationsProvider>
        <DialogsProvider>
          <DashboardLayout />
        </DialogsProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}

// EmployeeCreate.tsx
// EmployeeEdit.js
// EmployeeEdit.tsx
// EmployeeForm.js
// EmployeeForm.tsx
// EmployeeList.js
// EmployeeList.tsx
// EmployeeShow.js
// EmployeeShow.tsx
// PageContainer.js
// PageContainer.tsx
// SitemarkIcon.js
// SitemarkIcon.tsx
// ThemeSwitcher.js
// ThemeSwitcher.tsx
