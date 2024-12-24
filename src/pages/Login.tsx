import { useForm } from "react-hook-form";
import { useLoginUserMutation } from '../features/auth/authApi';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Loader2Icon } from "lucide-react";

//components
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
interface ApiError {
  data: {
    message: string;
  };
  status: number;
}

export default function Login() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await loginUser(values).unwrap();
      toast.success(result.message, {
        position: "top-center",
        draggable: true,
        theme: "dark",
      });
      navigate("/dashboard");
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.data?.message || 'An error occurred');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="relative">
          <Loader2Icon className="w-6 h-6 text-primary animate-spin absolute -bottom-8 left-1/2 transform -translate-x-1/2" />
        </div>
        <p className="mt-12 text-muted-foreground">Logging you in...</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="py-8">Sign in to join PINGMeetPONGERS🌏🏓</h2>
      <Card className="w-full md:w-2/3 lg:w-2/3 xl:w-2/3 2xl:w-1/3 mx-auto py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="mx-8">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your Username" {...field} autoComplete="username" />
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
                    <Input type="password" placeholder="Enter your Password" {...field} autoComplete="current-password" />
                  </FormControl>
                  <FormDescription>
                    This will be used to log in to your account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-around">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Login
              </Button>
              <Button variant="secondary">
                <Link to="/register">Create an account</Link>
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
}