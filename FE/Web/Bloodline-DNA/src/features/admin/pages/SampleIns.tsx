import { MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { Loading } from "../../../components";
import { Input } from "../../staff/components/booking/ui/input";
import { Textarea } from "../../staff/components/booking/ui/textarea";
import { Button } from "../../staff/components/sample/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../staff/components/sample/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../staff/components/sample/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../staff/components/sample/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../staff/components/sample/ui/table";
import { deleteSampleInsApi, getSampleInsListApi, updateSampleInsApi } from "../api/sample-insApi";
import type { SampleInsResponse, SampleInsUpdateRequest } from "../types/sample-ins";

const getSampleTypeLabel = (type: number): string => {
  switch (type) {
    case 1:
      return "Tăm bông miệng";
    case 2:
      return "Máu";
    case 3:
      return "Tóc có chân";
    case 4:
      return "Móng tay";
    case 5:
      return "Nước bọt";
    case 99:
      return "Khác";
    case 0:
      return "Không xác định";
    default:
      return `Loại #${type}`;
  }
};

const convertYouTubeUrlToEmbed = (url: string): string => {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  const videoId = videoIdMatch?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const SampleIns = () => {
  const [list, setList] = useState<SampleInsResponse[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SampleInsUpdateRequest | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getSampleInsListApi();
      setList(res);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      if (editing && "id" in editing) {
        const { id, sampleType, instructionText, mediaUrl } = editing;
        await updateSampleInsApi({ id, sampleType, instructionText, mediaUrl });
        setOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error("Submit error", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xoá?")) {
      await deleteSampleInsApi(id.toString());
      fetchData();
    }
  };

  return (
    <div className="min-h-screen p-8 bg-blue-50">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-blue-600">
            📋 Hướng dẫn lấy mẫu
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto min-h-[200px] flex items-center justify-center">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loading message="Đang tải dữ liệu..." />
            </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Loại mẫu</TableHead>
                  <TableHead className="text-center">Hướng dẫn</TableHead>
                  <TableHead className="text-center">Media</TableHead>
                  <TableHead className="text-center">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map((item) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell>
                      <span className="inline-block px-2 py-1 text-sm font-bold">
                        {getSampleTypeLabel(item.sampleType)}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-sm text-center truncate">
                      {item.instructionText}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.mediaUrl?.includes("youtube") ? (
                        <div
                          className="relative w-32 h-20 mx-auto cursor-pointer group"
                          onClick={() => {
                            setVideoUrl(convertYouTubeUrlToEmbed(item.mediaUrl));
                            setIsVideoOpen(true);
                          }}
                        >
                          <iframe
                            className="w-full h-full rounded pointer-events-none"
                            src={convertYouTubeUrlToEmbed(item.mediaUrl)}
                            title="Video hướng dẫn"
                          />
                          <div className="absolute inset-0 flex items-center justify-center rounded bg-black/40 group-hover:bg-black/60">
                            <span className="text-xs font-semibold text-white">
                              Xem lớn
                            </span>
                          </div>
                        </div>
                      ) : item.mediaUrl ? (
                        <img
                          src={item.mediaUrl}
                          alt="media"
                          className="object-cover w-20 mx-auto rounded h-14"
                        />
                      ) : (
                        <span className="italic text-gray-400">
                          Không có media
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              const { id, sampleType, instructionText, mediaUrl } =
                                item;
                              setEditing({
                                id,
                                sampleType,
                                instructionText,
                                mediaUrl,
                              });
                              setOpen(true);
                            }}
                          >
                            ✏️ Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(item.id)}
                          >
                            🗑️ Xoá
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog chỉnh sửa hướng dẫn */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-blue-700">
              🛠️ Chỉnh sửa hướng dẫn
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium">Loại mẫu (số)</label>
              <Input
                className="h-10"
                placeholder="Ví dụ: 1"
                value={editing?.sampleType ?? ""}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, sampleType: Number(e.target.value) } : prev
                  )
                }
              />
              {editing?.sampleType !== undefined && (
                <p className="mt-1 text-sm italic text-gray-500">
                  ➤ {getSampleTypeLabel(editing.sampleType)}
                </p>
              )}

            </div>
            <div>
              <label className="text-sm font-medium">Hướng dẫn chi tiết</label>
              <Textarea
                placeholder="Nhập hướng dẫn..."
                className="min-h-[150px]"
                value={editing?.instructionText ?? ""}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev
                      ? { ...prev, instructionText: e.target.value }
                      : prev
                  )
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Media URL (ảnh hoặc video)
              </label>
              <Input
                placeholder="https://..."
                value={editing?.mediaUrl ?? ""}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, mediaUrl: e.target.value } : prev
                  )
                }
              />
            </div>

            <div className="pt-2">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full text-white bg-blue-700 hover:bg-blue-800"
              >
                {submitting ? "⏳ Đang cập nhật..." : "Cập nhật hướng dẫn"}
              </Button>

            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog xem video lớn */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <iframe
            className="w-full aspect-video"
            src={videoUrl || ""}
            title="Video hướng dẫn"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SampleIns;
