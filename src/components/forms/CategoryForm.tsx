"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FileDialog from "../common/shared/file-dialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "../ui/form";
import { Icons } from "../ui/icons";
import { Input } from "../ui/input";
import ImageUpload from "@/app/(admin)/admin/categories/create/components/ImageUpload";
import { createCategory, editCategory } from "@/lib/actions/category.action";
import { toast } from "sonner";
import { type } from "os";

// Schema validation using Zod
const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  images: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type CategoryFormValues = z.infer<typeof categorySchema>;
const CategoryForm = ({ type, category }: any) => {
  // console.log("category", category);
  // Form setup with react-hook-form
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      images: category?.images || "",
    },
    mode: "onChange",
  });
  // console.log(form.getValues());

  // console.log(form.getValues());
  // State for loading
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Mock submit handler
  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      // console.log("Submitting category:", data);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      if (type === "edit") {
        const response = await editCategory(category.id, data);
        if (!response?.success) {
          toast.error("حصل خطا اثناء تعديل الفئة");
        } else {
          toast.success("تم تعديل الفئة بنجاح");
          form.reset();
        }
      } else {
        const response = await createCategory(data);

        if (!response?.success) {
          toast.error("حصل خطا اثناء انشاء الفئة");
        } else {
          toast.success("تم انشاء الفئة بنجاح");
          form.reset();
        }
      }
    } catch (error) {
      console.error("Error submitting category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <Form {...form}>
        <form
          className="grid gap-10 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-center gap-4 w-full lg:flex-row">
            <div className="lg:w-1/3 w-full flex flex-col items-start gap-2">
              <h4 className="text-stone-800 font-semibold">الصورة</h4>
              {type === "edit" ? (
                <p>قم بتعديل صورة الفئة من هنا</p>
              ) : (
                <p>قم برفع صورة الفئة من هنا</p>
              )}
            </div>
            <div className="lg:w-2/3 w-full">
              <Card className="p-8 w-full">
                <div className="my-4">
                  <FormItem className="flex w-full flex-col gap-1.5">
                    <FormLabel>الصورة</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={form.getValues("images") || ""}
                        onChange={(value) => form.setValue("images", value)}
                      />
                    </FormControl>
                    <UncontrolledFormMessage
                      message={form.formState.errors.images?.message}
                    />
                  </FormItem>
                </div>
              </Card>
            </div>
          </div>

          <div className="border-dotted w-full border-2" />

          <div className="flex flex-col items-center gap-4 w-full lg:flex-row">
            <div className="lg:w-1/3 w-full flex flex-col items-start gap-2">
              <h4 className="text-stone-800 font-semibold">التفاصيل</h4>
              {type === "edit" ? (
                <p>تعديل تفاصيل الفئة من هنا</p>
              ) : (
                <p>اضف تفاصيل الفئة من هنا</p>
              )}
            </div>
            <div className="lg:w-2/3 w-full">
              <Card className="p-8 w-full">
                <div className="my-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="اسم الفئة"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            </div>
          </div>

          <div className="flex items-end justify-end">
            <Button disabled={isSubmitting} className="md:w-[200px]">
              {isSubmitting ? (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : type === "edit" ? (
                <span>تعديل الفئة</span>
              ) : (
                <span>اضافة الفئة</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </React.Fragment>
  );
};

export default CategoryForm;
