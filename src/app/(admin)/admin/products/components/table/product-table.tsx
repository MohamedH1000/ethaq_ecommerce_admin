"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading: Boolean;
}

export function ProductTable<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/products?page=${page}&limit=10&name=${nameFilter}`
      );
      const result = await response.json();
      setData(result.data);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, nameFilter]);

  const handleFilterChange = (value: string) => {
    setNameFilter(value);
    setPage(1); // Reset to first page when filtering
  };
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: page - 1, // TanStack uses 0-based index
        pageSize: 10,
      },
    },
  });

  return (
    <div>
      <div className="flex items-center py-4 gap-4 flex-wrap max-md:flex-col max-md:items-start">
        <Input
          placeholder="تصفية على حسب الاسم"
          value={nameFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border" dir="rtl">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-right">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-right">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="flex items-center justify-center">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center "
                >
                  {isLoading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    "لا توجد نتائج"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          السابق
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= totalPages}
        >
          القادم
        </Button>
      </div>
    </div>
  );
}
