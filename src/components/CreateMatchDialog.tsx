import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useCreateMatchMutation } from '@/features/matches/matchesApi'

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DatePicker } from "./DatePicker";
import { useDate } from './DateContext';
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
    date: z.date().min(new Date(), {
        message: "Please select a date in the future.",
    }),
});

interface MatchFormValues {
    _id: string;
    code: string;
    name: string;
    place: string;
    date: Date;
    owner: string;
    players: string[];
}


export function CreateMatchDialog() {
    const { date } = useDate();
    const form = useForm<MatchFormValues>({
        resolver: zodResolver(matchFormSchema),
        defaultValues: {
            _id: "",
            code: "",
            name: "",
            place: "",
            date: date,
            owner: "",
            players: []
        },
    });
    const [createMatch] = useCreateMatchMutation();

    const onSubmit: SubmitHandler<MatchFormValues> = async (values) => {
        try {
            const result = await createMatch(values).unwrap();
            toast.success(result.message, {
                theme: "colored"
            });
        } catch (error: unknown) {
            if (typeof error === "object" && error !== null && 'data' in error) {
                const serverError = (error as { data: { message?: string } }).data;
                console.log("serverError", serverError);
                if (serverError.message) {
                    toast.error(serverError.message);
                }
            } else {
                toast.error("An unknown error occurred");
            }
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-purple-600 text-white hover:bg-purple-700">
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="mx-6">
                                    <FormLabel>Match name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter the match name" {...field} autoComplete="name" />
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
                                        <Input placeholder="Enter the match location" {...field} autoComplete="place" />
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
    );
}
