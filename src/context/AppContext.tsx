"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Persona, PERSONAS, calculateMatchScore } from "../data/mockData";
import { useAuth } from "./AuthContext";

export interface Application {
  jobId: string;
  templateText: string;
  appliedAt: string;
  status: "applied" | "review" | "interview" | "rejected" | "accepted";
}

export interface UserFeedback {
  jobId: string;
  isAccessible: boolean;
  hasAccommodation: boolean;
  isDescriptionAccurate: boolean;
  rating: number;
  comments: string;
  submittedAt: string;
}

interface AppContextType {
  currentPersona: Persona;
  selectedNeeds: string[]; // Accessibility keys required by current user
  jobPreferences: {
    role: string;
    location: string;
    type: string;
    experience: string;
    salary: string;
  };
  onboardingStep: number;
  isOnboardingCompleted: boolean;
  appliedJobs: Application[];
  feedbacks: UserFeedback[];
  toast: { message: string; type: "success" | "info" | "warning" } | null;
  
  // Setters/Actions
  refreshProfile: () => Promise<void>;
  updatePersona: (updated: Partial<Persona>) => void;
  switchPersona: (personaId: string) => void;
  toggleNeed: (needKey: string) => void;
  setNeeds: (needs: string[]) => void;
  updatePreferences: (prefs: Partial<AppContextType["jobPreferences"]>) => void;
  nextOnboardingStep: () => void;
  prevOnboardingStep: () => void;
  setOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  applyForJob: (jobId: string, templateText: string) => Promise<void>;
  cancelApplication: (jobId: string) => Promise<void>;
  submitFeedback: (feedback: Omit<UserFeedback, "submittedAt">) => void;
  showToast: (message: string, type?: "success" | "info" | "warning") => void;
  clearToast: () => void;
  resetAppState: () => void;
  savedJobIds: string[];
  toggleSaveJob: (jobId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentPersona, setCurrentPersona] = useState<Persona>(PERSONAS[0]); // Default Sinta
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(PERSONAS[0].needs);
  
  const [jobPreferences, setJobPreferences] = useState({
    role: "Admin & Pelayanan Chat",
    location: "Jakarta Barat / Remote",
    type: "remote",
    experience: "Pemula (0-2 tahun)",
    salary: "Rp 3.500.000 - Rp 5.500.000"
  });

  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(false);
  const [appliedJobs, setAppliedJobs] = useState<Application[]>([]);
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [toast, setToast] = useState<AppContextType["toast"]>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedPersonaId = localStorage.getItem("app-personaid");
    if (savedPersonaId) {
      const localSaved = localStorage.getItem("app-mockpersona-" + savedPersonaId);
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          setCurrentPersona(parsed);
          setSelectedNeeds(parsed.needs || []);
        } catch (e) {
          console.error(e);
        }
      } else {
        const persona = PERSONAS.find(p => p.id === savedPersonaId);
        if (persona) {
          setCurrentPersona(persona);
          setSelectedNeeds(persona.needs);
        }
      }
    }
    
    const savedNeeds = localStorage.getItem("app-selectedneeds");
    if (savedNeeds) {
      try {
        setSelectedNeeds(JSON.parse(savedNeeds));
      } catch (e) {
        console.error(e);
      }
    }

    const savedPrefs = localStorage.getItem("app-preferences");
    if (savedPrefs) {
      try {
        setJobPreferences(JSON.parse(savedPrefs));
      } catch (e) {
        console.error(e);
      }
    }

    const savedOnboardingCompleted = localStorage.getItem("app-onboardingcompleted") === "true";
    setIsOnboardingCompleted(savedOnboardingCompleted);

    const savedApplications = localStorage.getItem("app-applications");
    if (savedApplications) {
      try {
        setAppliedJobs(JSON.parse(savedApplications));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialDummyApps: Application[] = [
        {
          jobId: "1",
          templateText: "Halo, saya tertarik dengan posisi Admin Online...",
          appliedAt: "10 Juli 2026",
          status: "applied"
        },
        {
          jobId: "2",
          templateText: "Berikut portofolio desain saya...",
          appliedAt: "9 Juli 2026",
          status: "review"
        },
        {
          jobId: "3",
          templateText: "Saya mahir menggunakan pembaca layar NVDA...",
          appliedAt: "8 Juli 2026",
          status: "interview"
        },
        {
          jobId: "4",
          templateText: "Saya memiliki pengalaman CS chat...",
          appliedAt: "7 Juli 2026",
          status: "accepted"
        },
        {
          jobId: "5",
          templateText: "Saya terbiasa mengelola Canva...",
          appliedAt: "5 Juli 2026",
          status: "rejected"
        }
      ];
      setAppliedJobs(initialDummyApps);
      localStorage.setItem("app-applications", JSON.stringify(initialDummyApps));
    }

    const savedFeedbacks = localStorage.getItem("app-feedbacks");
    if (savedFeedbacks) {
      try {
        setFeedbacks(JSON.parse(savedFeedbacks));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Load applications from Supabase when user is logged in
  useEffect(() => {
    if (!user) return;
    import("../lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase
        .from("job_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("applied_at", { ascending: false })
        .then(({ data, error }) => {
          if (data && data.length > 0 && !error) {
            const mapped: Application[] = data.map((row: Record<string, unknown>) => ({
              jobId: row.job_id as string,
              templateText: (row.template_text as string) || "",
              appliedAt: new Date(row.applied_at as string).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
              }),
              status: row.status as Application["status"]
            }));
            setAppliedJobs(mapped);
          } else if (data && data.length === 0 && !error) {
            // Seed Supabase with dummy applications for the logged-in user
            const initialDummies = [
              { user_id: user.id, job_id: "1", template_text: "Halo, saya tertarik dengan posisi Admin Online...", status: "applied" },
              { user_id: user.id, job_id: "2", template_text: "Berikut portofolio desain saya...", status: "review" },
              { user_id: user.id, job_id: "3", template_text: "Saya mahir menggunakan pembaca layar NVDA...", status: "interview" },
              { user_id: user.id, job_id: "4", template_text: "Saya memiliki pengalaman CS chat...", status: "accepted" },
              { user_id: user.id, job_id: "5", template_text: "Saya terbiasa mengelola Canva...", status: "rejected" }
            ];
            supabase.from("job_applications").insert(initialDummies).then(() => {
              const mapped: Application[] = initialDummies.map(d => ({
                jobId: d.job_id,
                templateText: d.template_text,
                appliedAt: new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                }),
                status: d.status as Application["status"]
              }));
              setAppliedJobs(mapped);
            });
          }
        });
    });
  }, [user]);

  // Load and sync user profile if logged in via Supabase
  useEffect(() => {
    if (!user) {
      // Revert to localStorage persona or default to Sinta when logged out
      const savedPersonaId = localStorage.getItem("app-personaid");
      if (savedPersonaId) {
        const persona = PERSONAS.find(p => p.id === savedPersonaId);
        if (persona) {
          setCurrentPersona(persona);
          setSelectedNeeds(persona.needs);
          return;
        }
      }
      setCurrentPersona(PERSONAS[0]);
      setSelectedNeeds(PERSONAS[0].needs);
      return;
    }

    // Immediately set basic persona details from user metadata (faster loading)
    const metaFullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
    const metaDisabilityType = user.user_metadata?.disability_type || "Umum";
    const metaNeeds = user.user_metadata?.accessibility_needs || [];

    let localWS = [];
    const savedWS = localStorage.getItem("app-workingstyle-" + user.id);
    if (savedWS) {
      try { localWS = JSON.parse(savedWS); } catch (e) {}
    }
    let localTC = [];
    const savedTC = localStorage.getItem("app-targetcareers-" + user.id);
    if (savedTC) {
      try { localTC = JSON.parse(savedTC); } catch (e) {}
    }
    let localLoc = "Jakarta";
    const savedLoc = localStorage.getItem("app-location-" + user.id);
    if (savedLoc) {
      localLoc = savedLoc;
    }

    const defaultPersona = PERSONAS.find(p => p.name.toLowerCase() === metaFullName.toLowerCase() || p.id === user.id) || PERSONAS[0];

    const initialPersona: Persona = {
      id: user.id,
      name: metaFullName,
      avatar: user.user_metadata?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      disabilityType: metaDisabilityType === "neurodivergent" ? "Neurodivergent (ADHD / Autisme)" :
                      metaDisabilityType === "daksa" ? "Disabilitas Fisik / Daksa (kursi roda, dll.)" :
                      metaDisabilityType === "rungu" ? "Tuli / Hard of Hearing (rungu)" :
                      metaDisabilityType === "netra" ? "Tunanetra / Low Vision (netra)" :
                      metaDisabilityType === "wicara" ? "Disabilitas Wicara" :
                      metaDisabilityType === "other" ? "Disabilitas lainnya" : "Umum",
      needs: metaNeeds,
      bio: "Profil pengguna terdaftar di AksesKerjaMu. Siap mencari karir inklusif.",
      skills: ["Komunikasi", "Kerjasama Tim"],
      experience: "Pengalaman baru dimulai",
      education: "",
      workingStyle: localWS,
      targetCareers: localTC,
      location: localLoc,
      portfolios: defaultPersona.portfolios || [],
      certificates: defaultPersona.certificates || []
    };

    setCurrentPersona(initialPersona);
    setSelectedNeeds(initialPersona.needs);

    const hasCompletedOnboarding = !!user.user_metadata?.disability_type;
    if (!hasCompletedOnboarding) {
      return;
    }

    // Fetch full profiles row from Supabase
    import("../lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data, error }) => {
          if (error || !data) {
            // Profile doesn't exist yet (e.g. registered via Google OAuth).
            // Let's create it!
            const fallbackProfile = {
              id: user.id,
              full_name: metaFullName,
              email: user.email || "",
              disability_type: metaDisabilityType === "Umum" ? "none" : metaDisabilityType,
              accessibility_needs: metaNeeds,
              avatar: user.user_metadata?.avatar_url || user.user_metadata?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
              bio: "Profil pengguna terdaftar di AksesKerjaMu. Siap mencari karir inklusif.",
              skills: ["Komunikasi", "Kerjasama Tim"],
              experience: "Pengalaman baru dimulai",
              education: "",
              working_style: localWS,
              target_careers: localTC,
              location: localLoc,
              portfolios: [],
              certificates: []
            };
            supabase.from("profiles").upsert(fallbackProfile).then(({ error: upsertErr }) => {
              if (upsertErr) {
                console.error("Error creating oauth profile:", upsertErr.message);
              } else {
                // Refresh profile data locally
                refreshProfile();
              }
            });
            return;
          }

          if (data && !error) {
            let localWS = [];
            const savedWS = localStorage.getItem("app-workingstyle-" + data.id);
            if (savedWS) {
              try { localWS = JSON.parse(savedWS); } catch (e) {}
            } else {
              // Try to fallback to mock persona's working styles
              if (data.full_name === "Sinta" || data.id === "de32252a-995a-4bbf-85f0-5c6218d6e3c1") {
                localWS = ["structured_task", "independent_work", "written_communication"];
              } else if (data.full_name === "Budi" || data.id === "b00d1e34-995a-4bbf-85f0-5c6218d6e3c2") {
                localWS = ["independent_work", "team_collaboration", "quiet_environment"];
              } else if (data.full_name === "Adi" || data.id === "ad12252a-995a-4bbf-85f0-5c6218d6e3c3") {
                localWS = ["structured_task", "written_communication", "quiet_environment"];
              }
            }

            let localTC = [];
            const savedTC = localStorage.getItem("app-targetcareers-" + data.id);
            if (savedTC) {
              try { localTC = JSON.parse(savedTC); } catch (e) {}
            } else {
              if (data.full_name === "Sinta" || data.id === "de32252a-995a-4bbf-85f0-5c6218d6e3c1") {
                localTC = ["Admin Online", "Customer Support", "Data Entry"];
              } else if (data.full_name === "Budi" || data.id === "b00d1e34-995a-4bbf-85f0-5c6218d6e3c2") {
                localTC = ["Junior Graphic Designer", "Content Admin UMKM"];
              } else if (data.full_name === "Adi" || data.id === "ad12252a-995a-4bbf-85f0-5c6218d6e3c3") {
                localTC = ["Customer Support Chat", "Data Entry Assistant"];
              }
            }

            let localLoc = "Jakarta";
            const savedLoc = localStorage.getItem("app-location-" + data.id);
            if (savedLoc) {
              localLoc = savedLoc;
            } else {
              if (data.full_name === "Budi" || data.id === "b00d1e34-995a-4bbf-85f0-5c6218d6e3c2") {
                localLoc = "Bandung";
              } else if (data.full_name === "Adi" || data.id === "ad12252a-995a-4bbf-85f0-5c6218d6e3c3") {
                localLoc = "Surabaya";
              }
            }

            const defaultPersona = PERSONAS.find(p => 
              p.id === data.id || 
              data.full_name.toLowerCase().includes(p.name.toLowerCase()) ||
              p.name.toLowerCase().includes(data.full_name.toLowerCase())
            ) || PERSONAS[0];
            const defaultPortfolios = defaultPersona.portfolios || [];
            const defaultCertificates = defaultPersona.certificates || [];
            const dbPortfolios = (data.portfolios && data.portfolios.length > 0) ? data.portfolios : defaultPortfolios;
            const dbCertificates = (data.certificates && data.certificates.length > 0) ? data.certificates : defaultCertificates;

            // Seed profiles table if columns are empty/null
            if (!data.portfolios || data.portfolios.length === 0 || !data.certificates || data.certificates.length === 0) {
              supabase
                .from("profiles")
                .update({
                  portfolios: dbPortfolios,
                  certificates: dbCertificates
                })
                .eq("id", data.id)
                .then(({ error: seedErr }) => {
                  if (seedErr) console.error("Error seeding portfolios/certificates:", seedErr.message);
                });
            }

            setCurrentPersona({
              id: data.id,
              name: data.full_name,
              avatar: data.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
              disabilityType: data.disability_type === "neurodivergent" ? "Neurodivergent (ADHD / Autisme)" :
                              data.disability_type === "daksa" ? "Disabilitas Fisik / Daksa (kursi roda, dll.)" :
                              data.disability_type === "rungu" ? "Tuli / Hard of Hearing (rungu)" :
                              data.disability_type === "netra" ? "Tunanetra / Low Vision (netra)" :
                              data.disability_type === "wicara" ? "Disabilitas Wicara" :
                              data.disability_type === "other" ? "Disabilitas lainnya" : "Umum",
              needs: data.accessibility_needs || [],
              bio: data.bio || "Profil pengguna terdaftar di AksesKerjaMu. Siap mencari karir inklusif.",
              skills: data.skills && data.skills.length > 0 ? data.skills : ["Komunikasi", "Kerjasama Tim"],
              experience: data.experience || "Pengalaman baru dimulai",
              education: data.education || "",
              workingStyle: (data.working_style && data.working_style.length > 0) ? data.working_style : localWS,
              targetCareers: (data.target_careers && data.target_careers.length > 0) ? data.target_careers : localTC,
              location: data.location || localLoc,
              portfolios: dbPortfolios,
              certificates: dbCertificates
            });
            setSelectedNeeds(data.accessibility_needs || []);
          }
        });
    });
  }, [user]);

  // Sync selectedNeeds back to Supabase profiles table when changed by the user (autosave)
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      import("../lib/supabase/client").then(({ createClient }) => {
        const supabase = createClient();
        supabase
          .from("profiles")
          .update({ accessibility_needs: selectedNeeds })
          .eq("id", user.id)
          .then(({ error }) => {
            if (error) console.error("Error autosaving accessibility needs:", error.message);
          });
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [selectedNeeds, user]);

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const clearToast = () => setToast(null);

  const switchPersona = (personaId: string) => {
    const persona = PERSONAS.find(p => p.id === personaId);
    if (persona) {
      setCurrentPersona(persona);
      setSelectedNeeds(persona.needs);
      localStorage.setItem("app-personaid", personaId);
      localStorage.setItem("app-selectedneeds", JSON.stringify(persona.needs));
      
      // Update preferences based on persona
      const defaultPrefs = {
        role: persona.id === "budi" ? "Desainer Grafis" : persona.id === "adi" ? "Customer Support" : "Admin Online & Data Entry",
        location: persona.id === "budi" ? "Bandung / Hybrid" : persona.id === "adi" ? "Surabaya / Remote" : "Jakarta Barat / Remote",
        type: persona.id === "budi" ? "hybrid" : "remote",
        experience: persona.id === "budi" ? "Menengah (2-5 tahun)" : "Pemula (0-2 tahun)",
        salary: persona.id === "budi" ? "Rp 5.000.000 - Rp 7.000.000" : "Rp 3.500.000 - Rp 5.000.000"
      };
      setJobPreferences(defaultPrefs);
      localStorage.setItem("app-preferences", JSON.stringify(defaultPrefs));
      
      showToast(`Berhasil beralih ke Profil ${persona.name}`, "info");
    }
  };

  const toggleNeed = (needKey: string) => {
    setSelectedNeeds(prev => {
      const next = prev.includes(needKey) 
        ? prev.filter(k => k !== needKey) 
        : [...prev, needKey];
      localStorage.setItem("app-selectedneeds", JSON.stringify(next));
      
      // Keep currentPersona needs list in sync
      setCurrentPersona(curr => {
        const updated = { ...curr, needs: next };
        if (!user) {
          localStorage.setItem("app-mockpersona-" + curr.id, JSON.stringify(updated));
        }
        return updated;
      });
      return next;
    });
  };

  const setNeeds = (needs: string[]) => {
    setSelectedNeeds(needs);
    localStorage.setItem("app-selectedneeds", JSON.stringify(needs));
    
    // Keep currentPersona needs list in sync
    setCurrentPersona(curr => {
      const updated = { ...curr, needs: needs };
      if (!user) {
        localStorage.setItem("app-mockpersona-" + curr.id, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updatePreferences = (prefs: Partial<AppContextType["jobPreferences"]>) => {
    setJobPreferences(prev => {
      const next = { ...prev, ...prefs };
      localStorage.setItem("app-preferences", JSON.stringify(next));
      return next;
    });
  };

  const nextOnboardingStep = () => {
    setOnboardingStep(prev => prev + 1);
  };

  const prevOnboardingStep = () => {
    setOnboardingStep(prev => Math.max(0, prev - 1));
  };

  const completeOnboarding = () => {
    setIsOnboardingCompleted(true);
    localStorage.setItem("app-onboardingcompleted", "true");
    showToast("Profil Aksesibilitas Anda berhasil dikonfigurasi!", "success");
  };

  const applyForJob = async (jobId: string, templateText: string) => {
    const newApplication: Application = {
      jobId,
      templateText,
      appliedAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }),
      status: "applied"
    };

    // Update local state immediately
    setAppliedJobs(prev => {
      const filtered = prev.filter(app => app.jobId !== jobId);
      const next = [...filtered, newApplication];
      localStorage.setItem("app-applications", JSON.stringify(next));
      return next;
    });

    // Persist to Supabase if authenticated
    if (user) {
      try {
        const { createClient } = await import("../lib/supabase/client");
        const supabase = createClient();
        await supabase
          .from("job_applications")
          .upsert(
            {
              user_id: user.id,
              job_id: jobId,
              template_text: templateText,
              status: "applied"
            },
            { onConflict: "user_id,job_id" }
          );
      } catch (err) {
        console.error("Failed to save application to Supabase:", err);
      }
    }
  };
  
  const cancelApplication = async (jobId: string) => {
    // Update local state immediately
    setAppliedJobs(prev => {
      const next = prev.filter(app => app.jobId !== jobId);
      localStorage.setItem("app-applications", JSON.stringify(next));
      return next;
    });

    // Delete from Supabase if authenticated
    if (user) {
      try {
        const { createClient } = await import("../lib/supabase/client");
        const supabase = createClient();
        await supabase
          .from("job_applications")
          .delete()
          .eq("user_id", user.id)
          .eq("job_id", jobId);
      } catch (err) {
        console.error("Failed to delete application from Supabase:", err);
      }
    }
  };


  const submitFeedback = (feedback: Omit<UserFeedback, "submittedAt">) => {
    const newFeedback: UserFeedback = {
      ...feedback,
      submittedAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    };

    setFeedbacks(prev => {
      const next = [...prev, newFeedback];
      localStorage.setItem("app-feedbacks", JSON.stringify(next));
      return next;
    });

    // Update job application status to "review" or "interview" as an interactive mock element
    setAppliedJobs(prev => {
      const next = prev.map(app => {
        if (app.jobId === feedback.jobId) {
          return { ...app, status: "review" as const };
        }
        return app;
      });
      localStorage.setItem("app-applications", JSON.stringify(next));
      return next;
    });

    showToast("Terima kasih atas feedback rekrutmen inklusif Anda!", "success");
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const { createClient } = await import("../lib/supabase/client");
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data && !error) {
        let localWS = [];
        const savedWS = localStorage.getItem("app-workingstyle-" + data.id);
        if (savedWS) {
          try { localWS = JSON.parse(savedWS); } catch (e) {}
        } else {
          // Try to fallback to mock persona's working styles
          if (data.full_name === "Sinta" || data.id === "de32252a-995a-4bbf-85f0-5c6218d6e3c1") {
            localWS = ["structured_task", "independent_work", "written_communication"];
          } else if (data.full_name === "Budi" || data.id === "b00d1e34-995a-4bbf-85f0-5c6218d6e3c2") {
            localWS = ["independent_work", "team_collaboration", "quiet_environment"];
          } else if (data.full_name === "Adi" || data.id === "ad12252a-995a-4bbf-85f0-5c6218d6e3c3") {
            localWS = ["structured_task", "written_communication", "quiet_environment"];
          }
        }

        let localTC = [];
        const savedTC = localStorage.getItem("app-targetcareers-" + data.id);
        if (savedTC) {
          try { localTC = JSON.parse(savedTC); } catch (e) {}
        } else {
          if (data.full_name === "Sinta" || data.id === "de32252a-995a-4bbf-85f0-5c6218d6e3c1") {
            localTC = ["Admin Online", "Customer Support", "Data Entry"];
          } else if (data.full_name === "Budi" || data.id === "b00d1e34-995a-4bbf-85f0-5c6218d6e3c2") {
            localTC = ["Junior Graphic Designer", "Content Admin UMKM"];
          } else if (data.full_name === "Adi" || data.id === "ad12252a-995a-4bbf-85f0-5c6218d6e3c3") {
            localTC = ["Customer Support Chat", "Data Entry Assistant"];
          }
        }

        let localLoc = "Jakarta";
        const savedLoc = localStorage.getItem("app-location-" + data.id);
        if (savedLoc) {
          localLoc = savedLoc;
        } else {
          if (data.full_name === "Budi" || data.id === "b00d1e34-995a-4bbf-85f0-5c6218d6e3c2") {
            localLoc = "Bandung";
          } else if (data.full_name === "Adi" || data.id === "ad12252a-995a-4bbf-85f0-5c6218d6e3c3") {
            localLoc = "Surabaya";
          }
        }

        const defaultPersona = PERSONAS.find(p => 
          p.id === data.id || 
          data.full_name.toLowerCase().includes(p.name.toLowerCase()) ||
          p.name.toLowerCase().includes(data.full_name.toLowerCase())
        ) || PERSONAS[0];
        const defaultPortfolios = defaultPersona.portfolios || [];
        const defaultCertificates = defaultPersona.certificates || [];
        const dbPortfolios = (data.portfolios && data.portfolios.length > 0) ? data.portfolios : defaultPortfolios;
        const dbCertificates = (data.certificates && data.certificates.length > 0) ? data.certificates : defaultCertificates;

        setCurrentPersona({
          id: data.id,
          name: data.full_name,
          avatar: data.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
          disabilityType: data.disability_type === "neurodivergent" ? "Neurodivergent (ADHD / Autisme)" :
                          data.disability_type === "daksa" ? "Disabilitas Fisik / Daksa (kursi roda, dll.)" :
                          data.disability_type === "rungu" ? "Tuli / Hard of Hearing (rungu)" :
                          data.disability_type === "netra" ? "Tunanetra / Low Vision (netra)" :
                          data.disability_type === "wicara" ? "Disabilitas Wicara" :
                          data.disability_type === "other" ? "Disabilitas lainnya" : "Umum",
          needs: data.accessibility_needs || [],
          bio: data.bio || "Profil pengguna terdaftar di AksesKerjaMu. Siap mencari karir inklusif.",
          skills: data.skills && data.skills.length > 0 ? data.skills : ["Komunikasi", "Kerjasama Tim"],
          experience: data.experience || "Pengalaman baru dimulai",
          education: data.education || "",
          workingStyle: (data.working_style && data.working_style.length > 0) ? data.working_style : localWS,
          targetCareers: (data.target_careers && data.target_careers.length > 0) ? data.target_careers : localTC,
          location: data.location || localLoc,
          portfolios: dbPortfolios,
          certificates: dbCertificates,
          purpose: data.purpose || "",
          cover: data.cover || ""
        });
        setSelectedNeeds(data.accessibility_needs || []);
      }
    } catch (e) {
      console.error("Error refreshing profile:", e);
    }
  };

  const updatePersona = (updated: Partial<Persona>) => {
    setCurrentPersona(prev => {
      const next = { ...prev, ...updated };
      if (updated.workingStyle !== undefined) {
        localStorage.setItem("app-workingstyle-" + prev.id, JSON.stringify(updated.workingStyle));
      }
      if (updated.targetCareers !== undefined) {
        localStorage.setItem("app-targetcareers-" + prev.id, JSON.stringify(updated.targetCareers));
      }
      if (updated.location !== undefined) {
        localStorage.setItem("app-location-" + prev.id, updated.location);
      }
      if (updated.portfolios !== undefined) {
        localStorage.setItem("app-portfolios-" + prev.id, JSON.stringify(updated.portfolios));
      }
      if (updated.certificates !== undefined) {
        localStorage.setItem("app-certificates-" + prev.id, JSON.stringify(updated.certificates));
      }
      if (updated.purpose !== undefined) {
        localStorage.setItem("app-purpose-" + prev.id, updated.purpose);
      }
      if (updated.cover !== undefined) {
        localStorage.setItem("app-cover-" + prev.id, updated.cover);
      }
      if (!user) {
        localStorage.setItem("app-mockpersona-" + prev.id, JSON.stringify(next));
      }
      return next;
    });
    if (updated.needs) {
      setSelectedNeeds(updated.needs);
    }
    if (user) {
      import("../lib/supabase/client").then(({ createClient }) => {
        const supabase = createClient();
        const dbUpdate: any = {};
        if (updated.name !== undefined) dbUpdate.full_name = updated.name;
        if (updated.skills !== undefined) dbUpdate.skills = updated.skills;
        if (updated.bio !== undefined) dbUpdate.bio = updated.bio;
        if (updated.experience !== undefined) dbUpdate.experience = updated.experience;
        if (updated.education !== undefined) dbUpdate.education = updated.education;
        if (updated.needs !== undefined) dbUpdate.accessibility_needs = updated.needs;
        if (updated.workingStyle !== undefined) dbUpdate.working_style = updated.workingStyle;
        if (updated.targetCareers !== undefined) dbUpdate.target_careers = updated.targetCareers;
        if (updated.location !== undefined) dbUpdate.location = updated.location;
        if (updated.portfolios !== undefined) dbUpdate.portfolios = updated.portfolios;
        if (updated.certificates !== undefined) dbUpdate.certificates = updated.certificates;
        if (updated.purpose !== undefined) dbUpdate.purpose = updated.purpose;
        if (updated.cover !== undefined) dbUpdate.cover = updated.cover;
        if (updated.avatar !== undefined) dbUpdate.avatar = updated.avatar;

        if (Object.keys(dbUpdate).length > 0) {
          supabase
            .from("profiles")
            .update(dbUpdate)
            .eq("id", user.id)
            .then(({ error }) => {
              if (error) {
                console.warn("DB update failed, attempting basic fields fallback:", error.message);
                const basicUpdate: any = {};
                if (updated.name !== undefined) basicUpdate.full_name = updated.name;
                if (updated.skills !== undefined) basicUpdate.skills = updated.skills;
                if (updated.bio !== undefined) basicUpdate.bio = updated.bio;
                if (updated.experience !== undefined) basicUpdate.experience = updated.experience;
                if (updated.education !== undefined) basicUpdate.education = updated.education;
                if (updated.needs !== undefined) basicUpdate.accessibility_needs = updated.needs;
                if (updated.workingStyle !== undefined) basicUpdate.working_style = updated.workingStyle;
                
                supabase
                  .from("profiles")
                  .update(basicUpdate)
                  .eq("id", user.id)
                  .then(({ error: err2 }) => {
                    if (err2) console.error("Fallback DB update also failed:", err2.message);
                  });
              }
            });
        }
      });
    }
  };

  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);

  // 1. Mount effect for saved jobs (unauthenticated fallback)
  useEffect(() => {
    if (!user) {
      const localSaved = localStorage.getItem("app-saved-jobs");
      if (localSaved) {
        try {
          setSavedJobIds(JSON.parse(localSaved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [user]);

  // 2. Fetch saved jobs from Supabase when user changes (authenticated)
  useEffect(() => {
    if (user) {
      import("../lib/supabase/client").then(({ createClient }) => {
        const supabase = createClient();
        supabase
          .from("saved_jobs")
          .select("job_id")
          .eq("user_id", user.id)
          .then(({ data, error }) => {
            if (data && !error) {
              setSavedJobIds(data.map(item => item.job_id));
            }
          });
      });
    } else {
      setSavedJobIds([]);
    }
  }, [user]);

  const toggleSaveJob = async (jobId: string) => {
    const isSaved = savedJobIds.includes(jobId);
    let nextSaved = [...savedJobIds];

    if (isSaved) {
      nextSaved = nextSaved.filter(id => id !== jobId);
    } else {
      nextSaved.push(jobId);
    }

    setSavedJobIds(nextSaved);

    if (user) {
      try {
        const { createClient } = await import("../lib/supabase/client");
        const supabase = createClient();
        if (isSaved) {
          await supabase
            .from("saved_jobs")
            .delete()
            .eq("user_id", user.id)
            .eq("job_id", jobId);
        } else {
          await supabase
            .from("saved_jobs")
            .insert({ user_id: user.id, job_id: jobId });
        }
      } catch (err) {
        console.error("Error updating saved job in Supabase:", err);
      }
    } else {
      localStorage.setItem("app-saved-jobs", JSON.stringify(nextSaved));
    }
  };

  const resetAppState = () => {
    setCurrentPersona(PERSONAS[0]);
    setSelectedNeeds(PERSONAS[0].needs);
    setJobPreferences({
      role: "Admin & Pelayanan Chat",
      location: "Jakarta Barat / Remote",
      type: "remote",
      experience: "Pemula (0-2 tahun)",
      salary: "Rp 3.500.000 - Rp 5.500.000"
    });
    setOnboardingStep(0);
    setIsOnboardingCompleted(false);
    setAppliedJobs([]);
    setFeedbacks([]);
    setSavedJobIds([]);
    
    localStorage.removeItem("app-personaid");
    localStorage.removeItem("app-selectedneeds");
    localStorage.removeItem("app-preferences");
    localStorage.removeItem("app-onboardingcompleted");
    localStorage.removeItem("app-applications");
    localStorage.removeItem("app-feedbacks");
    localStorage.removeItem("app-saved-jobs");
    PERSONAS.forEach(p => localStorage.removeItem("app-mockpersona-" + p.id));

    showToast("Simulasi data berhasil direset.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        currentPersona,
        selectedNeeds,
        jobPreferences,
        onboardingStep,
        isOnboardingCompleted,
        appliedJobs,
        feedbacks,
        toast,
        refreshProfile,
        updatePersona,
        switchPersona,
        toggleNeed,
        setNeeds,
        updatePreferences,
        nextOnboardingStep,
        prevOnboardingStep,
        setOnboardingStep,
        completeOnboarding,
        applyForJob,
        cancelApplication,
        submitFeedback,
        showToast,
        clearToast,
        resetAppState,
        savedJobIds,
        toggleSaveJob
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider");
  }
  return context;
};
