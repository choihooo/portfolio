import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface Experience {
  date: string;
  title: string;
  organization: string;
  role: string;
  details: string[];
  image: string;
  post?: { [key: string]: string }; // 포스트 항목 추가 (key: string, url: string 형식)
}

function Activities() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3; // 한 페이지에 표시할 항목 수

  useEffect(() => {
    fetch("/data/activities.json")
      .then((response) => response.json())
      .then((data) => {
        setExperiences(data.experience);
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  // 페이지 전환 함수
  const handlePrevPage = () => setCurrentPage(Math.max(0, currentPage - 1));
  const handleNextPage = () =>
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(experiences.length / itemsPerPage);
  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = currentPage * itemsPerPage;
  const currentItems = experiences.slice(indexOfFirstItem, indexOfLastItem);

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen overflow-hidden md:overflow-auto">
      <div className="flex justify-end gap-4 mb-3 max-w-[600px] min-w-[200px] w-[80%]">
        <button
          onClick={handlePrevPage}
          aria-label="Previous Page"
          disabled={currentPage === 0}
        >
          ◀
        </button>
        <button
          onClick={handleNextPage}
          aria-label="Next Page"
          disabled={currentPage === totalPages - 1}
        >
          ▶
        </button>
      </div>
      <div className="max-w-[600px] min-w-[200px] w-[80%] h-[300px]">
        <Accordion type="single" collapsible className="w-full">
          {currentItems.map((experience, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>
                <div className="text-2xl">
                  {experience.title}
                  <p className="text-xs text-[#5c5c5c]">{experience.date}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex h-5 gap-2 text-xs">
                  {experience.organization} <Separator orientation="vertical" />
                  {experience.role}
                </div>
                <Separator className="my-2" />
                <div>
                  <img
                    className="w-[180px] h-[100px] cursor-pointer"
                    src={experience.image}
                    alt={experience.title}
                    onClick={() => openModal(experience.image)}
                  />
                </div>
                <Separator className="my-2" />
                <div className="text-base">
                  <ul className="pl-5 list-decimal">
                    {experience.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>

                  {experience.post && (
                    <>
                      <Separator className="my-2" />
                      <div className="mt-4">
                        <h4 className="font-bold">포스트 링크:</h4>
                        <ul className="pl-5 list-disc">
                          {Object.entries(experience.post).map(
                            ([key, url], idx) => (
                              <li key={idx}>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-me"
                                >
                                  {key}
                                </a>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div
          className="fixed top-[300vh] left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-90"
          onClick={handleModalClick}
        >
          <div className="relative w-auto h-auto">
            <img
              src={selectedImage}
              alt="Expanded View"
              className="max-w-[60vw] max-h-[60vh] object-contain"
            />
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 p-2 text-white bg-black"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activities;
