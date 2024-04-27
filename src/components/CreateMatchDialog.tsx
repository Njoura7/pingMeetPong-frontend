import { useForm ,Controller } from "react-hook-form";
import { useCreateMatchMutation } from '../features/matches/matchesApi'

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import  {DatePicker}  from "./DatePicker";
import { DateProvider, useDate } from './DateContext';
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
    name: z.string().min(4, {
        message: "Name must be at least 4 characters.",
    }),
    place: z.string().min(4, {
      message: "Place must be at least 4 characters.",
    }),
    date: z.date().min(new Date(),{ 
        message: "Please select a date in the future." ,
    }),
  });
  
  interface MatchFormValues {
    _id?: string;
    code?: string;
    name: string;
    place: string;
    date: Date;
}


export function CreateMatchDialog() {
    const { date } = useDate(); // Use the date from context
    const form = useForm({
        resolver: zodResolver(matchFormSchema),
        defaultValues: {
          name: "",
          place: "",
          date: date,
        },
      });
      const[createMatch] = useCreateMatchMutation();
   
      const onSubmit: (values: MatchFormValues) => Promise<void> = async (values) =>  {
        
        try {
          const result = await createMatch(values).unwrap();
          // Display the success message from the server
          console.log("CREATED",result);
          toast.success(result.message, {
            theme: "colored"
          });
    
            //! to be considered
        } catch (error) {
            if(typeof error === "object" && error !== null ){
                // Display the error message from the server
                toast.error(error.data.message);
              }
        }
      };
    return (
        <DateProvider>
             <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="font-bold py-2 px-4 rounded mb-4">
                    Create Match
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a Match</DialogTitle>
                    <DialogDescription>
                        You can create a match by entering the match details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="mx-6">
                            <FormLabel>Match name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter the match name" {...field} autoComplete="name"/>
                            </FormControl>
                            <FormDescription>
                                This is your public match display name.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="place"
                        render={({ field }) => (
                            <FormItem className="mx-6">
                            <FormLabel>Match location</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter the match location" {...field} autoComplete="place"/>
                            </FormControl>
                            <FormDescription>
                                This is your match location.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />


                        <Controller
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="mx-6">
                            <FormLabel>Match date</FormLabel>
                            <DatePicker selected={field.value} onSelect={(date) => field.onChange(date)} />
                            <FormDescription>
                                This is your match date.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />


                    <Button type="submit">Save changes</Button>
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
        </DateProvider>
       
    );
}