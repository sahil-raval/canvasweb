import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8, "Please enter your phone number"),
  enquiryType: z.string().min(1, "Please select an enquiry type"),
  message: z.string().min(10, "Please tell us a little more (min 10 characters)"),
});

type FormValues = z.infer<typeof formSchema>;

const enquiryTypes = [
  "Sell My Property",
  "Buy a Property",
  "Free Market Appraisal",
  "Property Management",
  "General Enquiry",
];

const inputClass =
  "h-12 bg-[#FAF8F5] border border-[#371628]/15 rounded-xl text-gray-800 placeholder:text-gray-400 focus:border-[#371628] focus:ring-1 focus:ring-[#371628]/20 transition-all duration-200 text-sm";

export function ContactForm({ dark = false }: { dark?: boolean }) {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", enquiryType: "", message: "" },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const property = params.get("property");
    if (property) {
      form.setValue("message", `Hi Canvas Real Estate,\n\nI'm interested in the property at:\n${property}\n\nPlease contact me to discuss further.`);
      form.setValue("enquiryType", "Buy a Property");
    }
  }, [form]);

  async function onSubmit(data: FormValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as any).error ?? "Something went wrong");
      }

      setSubmitted(true);
      form.reset();
    } catch (err: any) {
      toast({
        title: "Could not send your message",
        description: err?.message ?? "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const labelClass = `text-[10px] font-semibold font-sans uppercase tracking-[0.3em] mb-1.5 ${dark ? "text-white/60" : "text-[#371628]/60"}`;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-[#371628]/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#371628]" />
        </div>
        <h3 className={`text-2xl font-serif mb-3 ${dark ? "text-white" : "text-gray-900"}`}>Message Sent!</h3>
        <p className={`text-sm max-w-xs ${dark ? "text-white/60" : "text-gray-500"}`}>
          Pooja and Chandra will review your enquiry and get back to you within one business day.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" className={inputClass} {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="0400 000 000" className={inputClass} {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />
        </div>

        {/* Email */}
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Email Address</FormLabel>
            <FormControl>
              <Input placeholder="jane@example.com" type="email" className={inputClass} {...field} />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )} />

        {/* Enquiry Type */}
        <FormField control={form.control} name="enquiryType" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>I'm Looking To…</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {enquiryTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => field.onChange(type)}
                    className={`text-xs font-semibold px-3 py-2.5 rounded-xl border transition-all duration-200 text-left ${
                      field.value === type
                        ? "bg-[#371628] text-white border-[#371628] shadow-md"
                        : "bg-[#FAF8F5] text-gray-600 border-[#371628]/15 hover:border-[#371628]/40"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )} />

        {/* Message */}
        <FormField control={form.control} name="message" render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>How Can We Help?</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Tell us about your property goals…"
                className={`${inputClass} h-auto min-h-[110px] py-3 resize-none`}
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )} />

        {/* Trust line */}
        <p className={`text-xs ${dark ? "text-white/40" : "text-gray-400"}`}>
          🔒 Your details are confidential. We typically respond within 24 hours.
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-[#371628] text-white font-bold text-sm py-4 rounded-2xl hover:bg-[#2d1020] active:scale-95 transition-all duration-200 shadow-lg shadow-[#371628]/25 group disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send My Enquiry
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </>
          )}
        </button>
      </form>
    </Form>
  );
}
