interface ISubscriptionPlan {
  Name: string;
  Validity: Date;
}

interface INotificationPreference {
  Email: boolean;
  SMS: boolean;
  InApp: boolean;
  WhatsApp: boolean;
}

interface IUser {
  _id: string;
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  Gender: "Male" | "Female" | "Other";
  DOB?: Date;
  Email: string;
  PhoneNo: string;
  Password: string;
  SubscriptionPlan?: ISubscriptionPlan;
  DefaultCurrency: string;
  NotificationPreference: INotificationPreference;
}

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
