import { getAdminServices } from "@/features/adminServices/adminServicesApi";
import { getAdminContent } from "@/features/adminContent/adminContentApi";
import { getAdminMedia } from "@/features/adminMedia/adminMediaApi";
import { getAdminEnquiries } from "@/features/adminEnquiries/adminEnquiriesApi";
import { AdminServiceResponse } from "@/types/adminService.types";
import { AdminContentResponse, ContentSection } from "@/types/adminContent.types";
import { AdminEnquiryResponse, EnquiryStatus } from "@/types/adminEnquiry.types";

export interface AnalyticsSummary {
  totalServices: number;
  featuredServices: number;
  publishedContent: number;
  totalContent: number;
  totalMedia: number;
  newEnquiries: number;
  totalEnquiries: number;
  servicesByCategory: { name: string; count: number }[];
  enquiriesByStatus: { status: EnquiryStatus; label: string; count: number }[];
  contentBySection: { section: ContentSection; label: string; draft: number; published: number }[];
  recentEnquiries: AdminEnquiryResponse[];
}

export async function fetchAnalyticsData(): Promise<AnalyticsSummary> {
  const [servicesPage, contentPage, mediaPage, newEnquiriesPage, totalEnquiriesPage] =
    await Promise.all([
      getAdminServices(0, 100).catch(() => ({ content: [], totalElements: 0, pageNo: 0, pageSize: 0, totalPages: 0, last: true, first: true })),
      getAdminContent(undefined, 0, 100).catch(() => ({ content: [], totalElements: 0, pageNo: 0, pageSize: 0, totalPages: 0, last: true, first: true })),
      getAdminMedia(undefined, 0, 100).catch(() => ({ content: [], totalElements: 0, pageNo: 0, pageSize: 0, totalPages: 0, last: true, first: true })),
      getAdminEnquiries("NEW", 0, 100).catch(() => ({ content: [], totalElements: 0, pageNo: 0, pageSize: 0, totalPages: 0, last: true, first: true })),
      getAdminEnquiries(undefined, 0, 100).catch(() => ({ content: [], totalElements: 0, pageNo: 0, pageSize: 0, totalPages: 0, last: true, first: true })),
    ]);

  const services: AdminServiceResponse[] = servicesPage.content || [];
  const contents: AdminContentResponse[] = contentPage.content || [];
  const enquiries: AdminEnquiryResponse[] = totalEnquiriesPage.content || [];

  // Summary counts
  const totalServices = servicesPage.totalElements ?? services.length;
  const featuredServices = services.filter((s) => s.isFeatured).length;
  const publishedContent = contents.filter((c) => c.status === "PUBLISHED").length;
  const totalContent = contentPage.totalElements ?? contents.length;
  const totalMedia = mediaPage.totalElements ?? (mediaPage.content?.length || 0);
  const newEnquiries = newEnquiriesPage.totalElements ?? enquiries.filter((e) => e.status === "NEW").length;
  const totalEnquiries = totalEnquiriesPage.totalElements ?? enquiries.length;

  // Chart 1: Services by Category (or Category / Delivery Mode)
  const categoryCountMap: Record<string, number> = {};
  services.forEach((service) => {
    const catName =
      service.categoryNameEn ||
      (service.deliveryMode === "ONLINE" ? "Online Services" : "Visit Required");
    categoryCountMap[catName] = (categoryCountMap[catName] || 0) + 1;
  });

  const servicesByCategory = Object.entries(categoryCountMap).map(([name, count]) => ({
    name,
    count,
  }));

  // Chart 2: Enquiries by Status (NEW, CONTACTED, RESOLVED)
  const statusCounts: Record<EnquiryStatus, number> = {
    NEW: 0,
    CONTACTED: 0,
    RESOLVED: 0,
  };

  enquiries.forEach((e) => {
    if (statusCounts[e.status] !== undefined) {
      statusCounts[e.status] += 1;
    }
  });

  const enquiriesByStatus: { status: EnquiryStatus; label: string; count: number }[] = [
    { status: "NEW", label: "New", count: statusCounts.NEW },
    { status: "CONTACTED", label: "Contacted", count: statusCounts.CONTACTED },
    { status: "RESOLVED", label: "Resolved", count: statusCounts.RESOLVED },
  ];

  // Chart 3: Content Blocks by Section (Draft vs Published)
  const sectionMap: Record<string, { draft: number; published: number }> = {};

  contents.forEach((c) => {
    const section = c.section || "OTHER";
    if (!sectionMap[section]) {
      sectionMap[section] = { draft: 0, published: 0 };
    }
    if (c.status === "PUBLISHED") {
      sectionMap[section].published += 1;
    } else {
      sectionMap[section].draft += 1;
    }
  });

  const sectionLabels: Record<string, string> = {
    HOME_BANNER: "Home Banner",
    ABOUT_US: "About Us",
    ANNOUNCEMENT: "Announcement",
    OFFER: "Special Offer",
    FAQ: "FAQ Entries",
    WELCOME_POPUP: "Welcome Modal",
  };

  const contentBySection = Object.entries(sectionMap).map(([section, counts]) => ({
    section: section as ContentSection,
    label: sectionLabels[section] || section,
    draft: counts.draft,
    published: counts.published,
  }));

  // Recent 5 Enquiries
  const recentEnquiries = enquiries.slice(0, 5);

  return {
    totalServices,
    featuredServices,
    publishedContent,
    totalContent,
    totalMedia,
    newEnquiries,
    totalEnquiries,
    servicesByCategory,
    enquiriesByStatus,
    contentBySection,
    recentEnquiries,
  };
}
