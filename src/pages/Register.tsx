import { useForm } from "react-hook-form";
import { useRegisterUserMutation } from '../features/auth/authApi';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate,Link } from "react-router-dom";


//components
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
import { toast } from 'react-toastify';

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters.",
  }),
  confirmPassword: z.string(),
});

interface FormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [registerUser] = useRegisterUserMutation(); 
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match",{
        theme: "colored"
      });
      return;
    }
    try {
      const result = await registerUser(values).unwrap();
      // Display the success message from the server
      toast.success(result.message, {
        theme: "colored"
      });
      navigate("/login");
    } catch (error:any) {
      // Display the error message from the server
      toast.error(error.data.message);
      // console.log(error.data)
    }
  };
  return (
    <>
   <h2 className="py-8">Welcome to PING Meet PONG🌏🏓</h2>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="mx-8">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Username" {...field} autoComplete="username"/>
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
            <FormItem className="mx-8">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your Password" {...field} autoComplete="current-password"/>
              </FormControl>
              <FormDescription>
                This will be used to log in to your account.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mx-8">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your Password" {...field} autoComplete="new-password" />
              </FormControl>
              <FormDescription>
                Please enter your password again to confirm.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="my-5" type="submit">
          Register
        </Button> 
            <Button variant="ghost">
                <Link to="/login">Have an account?</Link>
            </Button>
      </form>
    </Form>
    </>
  );
}