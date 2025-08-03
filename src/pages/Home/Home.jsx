import { useEffect, useState, useRef } from "react";
import "./Home.css";
import { Link } from "react-router";

import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import NavBar from "../../components/NavBar/NavBar";
import Cursor from "../../components/Cursor/Cursor";
import Transition from "../../components/Transition/Transition";
import Inkwell from "../../components/Inkwell/Inkwell";

import { projects } from "./projects";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import ReactLenis from "@studio-freight/react-lenis";

import { HiArrowRight } from "react-icons/hi";
import { RiArrowRightDownLine } from "react-icons/ri";

const Home = () => {
  const manifestoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, 0);

    return () => clearTimeout(scrollTimeout);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: ".footer",
      start: "top 80%",
      onEnter: () => {
        document.querySelector(".collections").classList.add("light");
        document.querySelector(".footer").classList.add("light");
      },
      onLeaveBack: () => {
        document.querySelector(".collections").classList.remove("light");
        document.querySelector(".footer").classList.remove("light");
      },
    });

    if (!isMobile) {
      gsap.set(".project", { opacity: 0.35 });
    }

    if (!isMobile) {
      const projects = document.querySelectorAll(".project");

      projects.forEach((project) => {
        const projectImg = project.querySelector(".project-img img");

        project.addEventListener("mouseenter", () => {
          gsap.to(project, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });

          gsap.to(projectImg, {
            scale: 1.2,
            duration: 0.5,
            ease: "power2.out",
          });
        });

        project.addEventListener("mouseleave", () => {
          gsap.to(project, {
            opacity: 0.35,
            duration: 0.5,
            ease: "power2.out",
          });

          gsap.to(projectImg, {
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });
    }

    const manifestoText = new SplitType(".manifesto-title h1", {
      types: ["words", "chars"],
      tagName: "span",
      wordClass: "word",
      charClass: "char",
    });

    const style = document.createElement("style");
    style.textContent = `
       .word {
         display: inline-block;
         margin-right: 0em;
       }
       .char {
         display: inline-block;
       }
     `;
    document.head.appendChild(style);

    gsap.set(manifestoText.chars, {
      opacity: 0.25,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".manifesto",
        start: "top 35%",
        end: "bottom 75%",
        scrub: true,
        markers: false,
      },
    });

    manifestoText.chars.forEach((char, index) => {
      tl.to(
        char,
        {
          opacity: 1,
          duration: 0.1,
          ease: "none",
        },
        index * 0.1
      );
    });

    gsap.to(".marquee-text", {
      scrollTrigger: {
        trigger: ".marquee",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        markers: false,
        onUpdate: (self) => {
          const moveAmount = self.progress * -1000;
          gsap.set(".marquee-text", {
            x: moveAmount,
          });
        },
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      manifestoText.revert();
      style.remove();
    };
  }, [isMobile]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const rows = document.querySelectorAll(".row");
    const isMobileView = window.innerWidth <= 900;

    const getStartX = (index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      return direction * (isMobileView ? 150 : 300);
    };

    if (rows.length > 0) {
      rows.forEach((row, index) => {
        const existingTrigger = ScrollTrigger.getAll().find(
          (st) => st.trigger === ".gallery" && st.vars?.targets === row
        );
        if (existingTrigger) {
          existingTrigger.kill();
        }

        const startX = getStartX(index);

        gsap.set(row, { x: startX });

        gsap.to(row, {
          scrollTrigger: {
            trigger: ".gallery",
            start: "top bottom",
            end: "bottom top",
            scrub: isMobileView ? 0.5 : 1,
            onUpdate: (self) => {
              const moveAmount = startX * (1 - self.progress);
              gsap.set(row, {
                x: moveAmount,
              });
            },
          },
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMobile]);

  return (
    <ReactLenis root>
      <div className="home">
        <Cursor />
        <NavBar />
        <section className="hero" id="hero">
          <Inkwell />
          <div className="header-container">
            <div className="header h-1">
              <h1>Stories That Leave,</h1>
              <h1>Mark on Time</h1>
            </div>
            <div className="header h-2">
              <h1>Glam & Calm</h1>
            </div>
            <div className="header h-3">
              <h1>Stories That Leave,</h1>
              <h1>Mark on Time</h1>
            </div>
            <div className="header h-4">
              <h1>Glam & Calm</h1>
            </div>
          </div>
        </section>

        <section className="work" id="stories">
          <div className="container">
            <div className="work-header">
              <HiArrowRight size={13} />
              <p>Stories</p>
            </div>

            <div className="projects">
              <div className="project-col">
                {projects
                  .filter((project) => project.column === 1)
                  .map((project) => (
                    <Link to="/work" key={project.id}>
                      <div className="project">
                        <div className="project-img">
                          <img src={project.image} alt="Project Thumbnail" />
                        </div>
                        <div className="project-name">
                          <h2>{project.title}</h2>
                        </div>
                        <div className="project-description">
                          <p>{project.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>

              <div className="project-col">
                {projects
                  .filter((project) => project.column === 2)
                  .map((project) => (
                    <Link to="/work" key={project.id}>
                      <div className="project">
                        <div className="project-img">
                          <img src={project.image} alt="Project Thumbnail" />
                        </div>
                        <div className="project-name">
                          <h2>{project.title}</h2>
                        </div>
                        <div className="project-description">
                          <p>{project.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>

        <section className="manifesto" id="manifesto" ref={manifestoRef}>
          <div className="container">
            <div className="manifesto-header">
              <HiArrowRight size={13} />
              <p>Manifesto</p>
            </div>
            <div className="manifesto-title">
              <h1>
                <strong>We shape emotions in wood.</strong> From the radiant allure of <strong>Glam</strong> to the whisper-quiet poise of <strong>Calm</strong>, each surface is an invitation to feel something real.
              </h1>
              <h1>
                <strong>We honour nature.</strong> Every fibre is sourced responsibly, pressed with clean energy, and engineered to last beyond trends.
              </h1>
              <h1>
                <strong>Create boldly, live softly.</strong> The choice is yours; the craft is ours.
              </h1>
            </div>
          </div>
        </section>

        <section className="processes">
          <div className="container">
            <div className="process">
              <div className="process-title">
                <RiArrowRightDownLine />
                <p>CREATE</p>
              </div>
              <div className="process-info">
                <div className="process-icon">
                  <div className="process-icon-wrapper">
                    <img src="/processes/icon-1.png" alt="" />
                  </div>
                </div>
                <div className="process-description">
                  <p>
                    From concept to creation: 40+ years of expertise, 200+ patterns, endless possibilities.
                  </p>
                </div>
              </div>
            </div>

            <div className="process">
              <div className="process-title">
                <RiArrowRightDownLine />
                <p>DESIGN</p>
              </div>
              <div className="process-info">
                <div className="process-icon">
                  <div className="process-icon-wrapper">
                    <img src="/processes/icon-2.png" alt="" />
                  </div>
                </div>
                <div className="process-description">
                  <p>
                  Precision from core to coating: High-pressure lamination, 240 m/min lines, zero-defect QC.
                  </p>
                </div>
              </div>
            </div>

            <div className="process">
              <div className="process-title">
                <RiArrowRightDownLine />
                <p>SUSTAIN</p>
              </div>
              <div className="process-info">
                <div className="process-icon">
                  <div className="process-icon-wrapper">
                    <img src="/processes/icon-3.png" alt="" />
                  </div>
                </div>
                <div className="process-description">
                  <p>
                  Beauty with a conscience: FSC® wood, E0 formaldehyde, 98 % recyclable by weight.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="marquee">
          <div className="marquee-text">
            <h1>Stories That Leave, Mark on Time</h1>
          </div>
        </div>

        <section className="showreel">
          <VideoPlayer />
        </section>

        <section className="about" id="about">
          <div className="container">
            <div className="about-main">
              <h1>
              We craft surfaces  
that speak to the senses.  
Glam turns light into theatre;  
Calm distils silence into form.  
Every panel invites people  
to feel architecture—not
just see it.
              </h1>
            </div>
            <div className="about-secondary">
              <div className="about-block">
                <p>
                Engineered with FSC-certified cores and next-gen lamination lines, our panels unite precision manufacturing with timeless artistry—beauty designed to last.
                </p>
              </div>
              <div className="about-block">
                <p>
                From bold hotel lobbies to restorative wellness retreats, architects worldwide choose Glam & Calm to set the mood and make every space unforgettable.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="gallery">
          <div className="gallery-wrapper">
            <div className="row">
              <div className="img">
                <img src="/marquee/barok_mavi.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/marquee/nar_cicegi.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/marquee/akik_kizil.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/marquee/R_VT_032.jpg" alt="" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src="/marquee/R_SGL_715.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/marquee/R_SGL_849.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/marquee/R_SGL_98A.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/marquee/R_SGL_859.jpg" alt="" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src="/marquee/R_SGL_549.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/marquee/R_SGL_Z30.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/marquee/R_SGL_Z38.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/marquee/R_SGL_Z39.jpg" alt="" />
              </div>
            </div>
            <div className="row">
              <div className="img">
                <img src="/marquee/pastel_mavi.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/marquee/rubi.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/marquee/nil_yesil.jpg" alt="" />
              </div>
              <div className="img">
                <img src="/marquee/beyaz_mermer.jpg" alt="" />
              </div>
            </div>
          </div>
        </section>

        <section className="collections" id="collections">
          <div className="container">
            <div className="collections-header">
              <HiArrowRight />
              <p>Collections</p>
            </div>

            <div className="collections-intro">
              <h1>
              The choice is yours; &nbsp;&nbsp;&nbsp; the craft is ours.
              </h1>
            </div>

            <div className="collection-item collection-1">
              <div className="collection-category">
                <p>Glam</p>
              </div>
              <div className="collection-profile">
                <div className="collection-img">
                  <img src="/collection/glam.png" alt="" />
                </div>
                <div className="collection-info">
                  <div className="collection-name">
                    <p>
                    Dare to <br />
                      Shine
                    </p>
                  </div>
                  <div className="collection-details">
                    <div className="collection-toggle">
                      <HiArrowRight size={24} />
                    </div>
                    <div className="collection-copy">
                      <p>
                      High-gloss panels that turn any wall into a spotlight: champagne marble, runway reds, and electric cobalt for spaces that insist on dazzling.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="collection-index">
                <p>(01)</p>
                <h1>Glam Collection</h1>
              </div>
            </div>

            <div className="collection-item collection-2">
              <div className="collection-category">
                <p>Calm</p>
              </div>
              <div className="collection-profile">
                <div className="collection-img">
                  <img src="/collection/calm.png" alt="" />
                </div>
                <div className="collection-info">
                  <div className="collection-name">
                    <p>
                    Breathe in <br />
                    Silence
                    </p>
                  </div>
                  <div className="collection-details">
                    <div className="collection-toggle">
                      <HiArrowRight size={24} />
                    </div>
                    <div className="collection-copy">
                      <p>
                      Velvet-matte surfaces in leaf-green, travertine beige, and misty oak; they soften light and sound, wrapping rooms in slow-living stillness.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="collection-index">
                <p>(02)</p>
                <h1>Calm Collection</h1>
              </div>
            </div>
          </div>
        </section>

        <section className="footer" id="contact">
          <div className="container">
            <div className="footer-header">
              <HiArrowRight />
              <p>Contact</p>
            </div>

            <div className="footer-title">
              <h1>Get in Touch</h1>
            </div>

            <div className="footer-email">
              <p>Bring Glam & Calm into your next project</p>
              <h2>info@yildizentegre.com</h2>
            </div>

            <div className="footer-content">
              <div className="footer-col">
                <div className="footer-col-header">
                  <p>Our Spaces</p>
                </div>

                <div className="footer-col-content">
                  <div className="footer-sub-col">
                    <div className="location">
                      <h3>Studio</h3>
                      <p>Erenköy Mah. Kadıköy,</p>
                      <p>Nurettin Ali Berkol Sok. No:3</p>
                      <p>İstanbul 34744</p>
                      <p>Türkiye</p>

                      <p>
                        <HiArrowRight /> View on map
                      </p>
                    </div>
                  </div>
                  <div className="footer-sub-col">
                    <div className="location">
                      <h3>Head Office</h3>
                      <p>Kartepe - Kocaeli,</p>
                      <p>Arslanbey OSB Mah. 1. Cad</p>
                      <p>Kocaeli 41285</p>
                      <p>Türkiye</p>

                      <p>
                        <HiArrowRight /> View on map
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-col">
                <div className="footer-col-header">
                  <p>Brand</p>
                </div>
                <div className="footer-logo">
                  <h2>Glam § Calm</h2>
                  <p>Where elegance meets tranquility</p>
                  <div className="yildiz-logo">
                    <img src="/yildiz-logo-placeholder.png" alt="YILDIZENTEGRE Logo" className="yildiz-logo-img" />
                  </div>
                </div>
              </div>
              <div className="footer-col">
                <div className="footer-col-header">
                  <p>Follow Us</p>
                </div>
                <div className="footer-sub-col">
                  <p>Instagram</p>
                  <p>LinkedIn</p>
                  <p>Twitter</p>
                  <p>Youtube</p>
                  <p>Facebook</p>
                </div>
              </div>
            </div>

            <div className="made-by">
              <p>Made by <a href="https://kalm.works" target="_blank" rel="noopener noreferrer">kalm.works</a></p>
            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
};

export default Transition(Home);
