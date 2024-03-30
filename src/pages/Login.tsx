import { useForm } from "react-hook-form";
import { useLoginUserMutation } from '../features/auth/authApi';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate,Link } from "react-router-dom";


//components
import { Button  } from "@/components/ui/button"
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
  password: z.string(),
});

interface FormValues {
  username: string;
  password: string;
}

export default function Login() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [loginUser] = useLoginUserMutation();
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await loginUser(values).unwrap();
      toast.success(result.message, {
        theme: "dark"
      });
      navigate("/dashboard");
   
    } catch (error:any) {
        // console.log(error.data)
        toast.error(error.data.message)
    }
  };

  return (
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
        <Button type="submit">
          Login
        </Button> 
            <Button>
                <Link to="/register">Create an account</Link>
            </Button>
      </form>
    </Form>
  );
}