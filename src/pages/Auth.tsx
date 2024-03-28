import { useForm } from "react-hook-form";
import { useDispatch,useSelector } from 'react-redux';
import { logOut } from '../features/auth/authSlice';
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterUserMutation, useLoginUserMutation } from '../features/auth/authApi';
import { selectCurrentUser } from '../features/auth/authSlice';


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string(),
  confirmPassword: z.string(),
});


interface FormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

export function ProfileForm({ isRegistering }: { isRegistering: boolean }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });


  const [registerUserMutation, { isLoading: isRegisteringLoading }] = useRegisterUserMutation();
  const [loginUserMutation, { isLoading: isLoginLoading }] = useLoginUserMutation();
  
  const onSubmit = async (values: FormValues) => {
    if (isRegistering && values.password !== values.confirmPassword) {
      // Show an error message
      return;
    }
  
    if (isRegistering) {
      await registerUserMutation({ username: values.username, password: values.password });
    } else {
      await loginUserMutation({ username: values.username, password: values.password });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your Password" {...field} />
              </FormControl>
              <FormDescription>
                This will be used to log in to your account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isRegistering && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your Password" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter your password again to confirm.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={isRegisteringLoading || isLoginLoading}>
          {isRegistering ? 'Register' : 'Login'}
        </Button> 
      </form>
    </Form>
  );
}

const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser); // Get the current user

  const logout = () => {
    dispatch(logOut());
  };

  return (
    <>
      <h2>Auth</h2>
      {currentUser && (
        <button onClick={logout}>
          Log out
        </button>
      )}
      <ProfileForm isRegistering={isRegistering} />
      <Button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Have an account?' : 'Create an account'}
      </Button>
   
    </>
  );
};

export default Auth;