// src/components/template/TableComp.js
import { useMemo, useEffect, useState } from 'react';
import { useReactTable, flexRender, getCoreRowModel } from '@tanstack/react-table';
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useTheme } from '@/src/context/themecontext';
import useDeleteUser from '@/src/hooks/useDeleteUser';
import dynamic from 'next/dynamic';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import fa from './fa';

const JoditEditor = dynamic(
  () => import('jodit-react'),
  {
    ssr: false,
    loading: () => <p>در حال بارگیری ویرایشگر...</p>,
  }
);

const TableComp = ({ data }) => {
  const { isDark } = useTheme();
  const { mutate: deleteUser, isLoading: isDeleting } = useDeleteUser();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDelete = (id) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟')) {
      deleteUser(id);
    }
  };

  const handleView = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleExportExcel = () => {
    const transformedData = data.map((item) => ({
      نام: item.first__name,
      'نام خانوادگی': item.last__name,
      'تاریخ تولد': item.date,
      'نوع کاربر': item.idType === 'national' ? 'حقیقی' : 'حقوقی',
      [item.idType === 'national' ? 'کدملی' : 'شناسه اقتصادی']: item.idNumber,
      'شغل پاره‌وقت': item.part_time_job ? 'بله' : 'خیر',
      'شغل تمام وقت': item.full_time_job ? 'بله' : 'خیر',
      'کد پستی': item.postal_code,
      رزومه: item.resume,
    }));

    const worksheet = XLSX.utils.json_to_sheet(transformedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'users.xlsx');
  };

  const secondconfig = useMemo(
    () => ({
      language: 'fa',
      i18n: { fa },
      style: { fontFamily: 'gandom' },
      readonly: true,
      placeholder: 'متن نمایشی...',
      buttons: false,
      theme: isDark ? 'dark' : 'light',
    }),
    [isDark]
  );

  const columns = useMemo(
    () => [
      {
        id: 'first_name',
        header: 'نام',
        accessorKey: 'first__name',
        cell: ({ row }) => row.original.first__name,
      },
      {
        id: 'last_name',
        header: 'نام خانوادگی',
        accessorKey: 'last__name',
        cell: ({ row }) => row.original.last__name,
      },
      {
        id: 'postal_code',
        header: 'کد پستی',
        accessorKey: 'postal_code',
        cell: ({ row }) => row.original.postal_code,
      },
      {
        id: 'full_time_job',
        header: 'شغل تمام وقت',
        accessorKey: 'full_time_job',
        cell: ({ row }) => (row.original.full_time_job ? 'بله' : 'خیر'),
      },
      {
        id: 'part_time_job',
        header: 'شغل پاره وقت',
        accessorKey: 'part_time_job',
        cell: ({ row }) => (row.original.part_time_job ? 'بله' : 'خیر'),
      },
      {
        id: 'actions',
        header: 'عملیات',
        cell: ({ row }) => (
          <div>
            <Button color="info" size="sm" onClick={() => handleView(row.original)} className="me-2">
              مشاهده
            </Button>
            <Button
              color="danger"
              size="sm"
              onClick={() => handleDelete(row.original._id)}
              disabled={isDeleting}
            >
              حذف
            </Button>
          </div>
        ),
      },
    ],
    [isDeleting]
  );

  const table = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
  });

  if (!isMounted) {
    return <div className="p-3">در حال بارگیری جدول...</div>;
  }

  return (
    <div dir="rtl">
      <Table dark={isDark} striped bordered hover className="mt-4">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                داده‌ای برای نمایش وجود ندارد
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Button
        color="success"
        disabled={data.length === 0}
        onClick={handleExportExcel}
        className="mb-3"
      >
        دریافت فایل اکسل
      </Button>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} className={isDark ? 'dark-modal' : ''}>
        <ModalHeader toggle={() => setModalOpen(false)}>جزئیات</ModalHeader>
        <ModalBody dir="rtl">
          {selectedItem && (
            <div>
              <p>نام: {selectedItem.first__name}</p>
              <p>نام خانوادگی: {selectedItem.last__name}</p>
              <p>تاریخ تولد: {selectedItem.date}</p>
              <p>کد پستی: {selectedItem.postal_code}</p>
              <p>شغل تمام وقت: {selectedItem.full_time_job ? 'بله' : 'خیر'}</p>
              <p>شغل پاره وقت: {selectedItem.part_time_job ? 'بله' : 'خیر'}</p>
              <div>
                <p>رزومه:</p>
                <JoditEditor config={secondconfig} value={selectedItem.resume} />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            بستن
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TableComp;