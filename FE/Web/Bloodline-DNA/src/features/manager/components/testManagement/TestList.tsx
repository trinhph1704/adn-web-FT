import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../../../staff/components/booking/ui/badge';
import { Button } from '../../../staff/components/sample/ui/button';
import { Card, CardContent } from '../../../staff/components/sample/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../staff/components/sample/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../staff/components/sample/ui/table';
import { getCollectionMethodLabel, type TestResponse } from '../../types/testService';
import ConfirmDeleteDialog from '../common/ConfirmDeleteDialog';

interface TestListProps {
  tests: TestResponse[];
  onEditTest: (testId: string) => void;
  onShowDetail: (test: TestResponse) => void;
  onDeleteTest?: (testId: string) => void;
}

const TestList: React.FC<TestListProps> = ({ tests, onEditTest, onShowDetail, onDeleteTest }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleOpenDeleteDialog = (testId: string, testName: string) => {
    setTestToDelete({ id: testId, name: testName });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (testToDelete && onDeleteTest) {
      onDeleteTest(testToDelete.id);
      setDeleteDialogOpen(false);
      setTestToDelete(null);
    }
  };

  return (
    <>
      <Card className="mb-8 shadow-lg">
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold pl-25">Tên</TableHead>
                <TableHead className="font-bold text-center">Giá</TableHead>
                <TableHead className="font-bold text-center">Thu</TableHead>
                <TableHead className="font-bold text-center">Hiệu lực</TableHead>
                <TableHead className="font-bold text-center">Trạng thái</TableHead>
                <TableHead className="font-bold text-center">Hoạt động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='text-xs'>
              {tests.length === 0 || tests.every(test => test.priceServices.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-gray-400">
                    Không có dữ liệu giá dịch vụ.
                  </TableCell>
                </TableRow>
              ) : (
                tests.flatMap(test =>
                  test.priceServices.length === 0
                    ? [
                      <TableRow key={test.id}>
                        <TableCell className="text-center">{test.name}</TableCell>
                        <TableCell colSpan={5} className="text-center text-gray-400">
                          Không có giá dịch vụ
                        </TableCell>
                      </TableRow>
                    ]
                    : test.priceServices.map(price => (
                      <TableRow
                        key={price.id}
                        className="transition cursor-pointer hover:bg-blue-50"
                        onClick={() => onShowDetail(test)}
                      >
                        <TableCell className="">{test.name}</TableCell>
                        <TableCell className="font-semibold text-center text-green-700">
                          {price.price.toLocaleString()} {price.currency}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" style={{ fontSize: "10px" }} className="text-blue-700 bg-blue-100 border-blue-200 ">
                            {getCollectionMethodLabel(price.collectionMethod)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="block text-xs text-gray-700">
                            {new Date(price.effectiveFrom).toLocaleDateString()} - {new Date(price.effectiveTo).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell style={{ fontSize: "10px" }} className="text-center">
                          <span
                            style={{ fontSize: "10px" }}
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${price.testServiceInfor.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {price.testServiceInfor.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                          </span>

                        </TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={e => e.stopPropagation()}>
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                  <circle cx="12" cy="5" r="1.5" fill="#2563eb" />
                                  <circle cx="12" cy="12" r="1.5" fill="#2563eb" />
                                  <circle cx="12" cy="19" r="1.5" fill="#2563eb" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={e => { e.stopPropagation(); onEditTest(test.id); }}>
                                <Pencil size={16} className="mr-2" /> Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={e => { e.stopPropagation(); handleOpenDeleteDialog(test.id, test.name); }}
                                className="text-red-600 focus:bg-red-50 focus:text-red-800"
                              >
                                <Trash2 size={16} className="mr-2" /> Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        testName={testToDelete?.name}
      />
    </>
  );
};

export default TestList;
