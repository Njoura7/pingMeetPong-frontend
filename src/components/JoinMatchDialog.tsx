import { useForm } from "react-hook-form";
import { useJoinMatchMutation } from '../features/matches/matchesApi'

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog";
import { Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; 
import { toast } from 'react-toastify';



const matchFormSchema = z.object({
    code: z.string().min(4, {
      message: "Code must be at least 4 characters.",
    }),
  
  });
  
  interface MatchFormValues {
    code: string;
  }

export function JoinMatchDialog() {
    const [joinMatch,{isLoading}]=useJoinMatchMutation();
    const form = useForm<MatchFormValues>({
        resolver: zodResolver(matchFormSchema),
        defaultValues: {
          code: "",
        },
      });
   const onSubmit=async(values: MatchFormValues)=>{
    try{
        const result = await joinMatch(values).unwrap();
        console.log("TEST:",result)
        toast.success(result.message, {
            theme: "colored",
        })
    } catch (error: unknown) { 
        // First, check if it's an object with a 'data' property
        if (typeof error === "object" && error !== null && 'data' in error) {
            const serverError = (error as { data: { message?: string } }).data;
            console.log("serverError", serverError);
        if (serverError.message) {
          toast.error(serverError.message);
        } 
      } 
      else {
        // Generic fallback error message
        toast.error("An unknown error occurred");     
      }
    }
   }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button  className="font-bold py-2 px-4 rounded mb-4">
                    Join a Match
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Join a Match</DialogTitle>
                    <DialogDescription>
                        You can join a match by entering the match code given by the host.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form   onSubmit={form.handleSubmit(onSubmit)}className="space-y-8">
                     
                        <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem className="mx-6">
                            <FormLabel>Match code</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter the match code" {...field} autoComplete="code"/>
                            </FormControl>
                            <FormDescription>
                                This is your match code .
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                    <Button type="submit" disabled={isLoading}>Join</Button>
                    </form>
                 </Form>
                <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}