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
    } catch (error) {
        if (error.data) {
          toast.error(error.data.message, {
            theme: "colored",
          });
        } else {
          toast.error("An error occurred", {
            theme: "colored",
          });
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