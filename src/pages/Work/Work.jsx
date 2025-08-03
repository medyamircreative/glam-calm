import React, { useEffect } from "react";
import "./Work.css";
import { Link } from "react-router";

import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import Cursor from "../../components/Cursor/Cursor";
import Transition from "../../components/Transition/Transition";
import BackButton from "../../components/BackButton/BackButton";

import { ReactLenis } from "@studio-freight/react-lenis";

import { IoMdArrowForward } from "react-icons/io";
import { IoIosArrowRoundForward } from "react-icons/io";

const Work = () => {
  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }, 0);

    return () => clearTimeout(scrollTimeout);
  }, []);

  return (
    <ReactLenis root>
      <Cursor />
      <div className="sample-project">
        <BackButton />

        <section className="sp-title">
          <div className="container">
            <h1>Terra Rosso - GLAM Series</h1>
          </div>
        </section>

        <section className="sp-banner">
          <img src="/stories/story7.png" alt="" />
        </section>

        <section className="sp-details">
          <div className="container">
            <div className="sp-details-col">
              <p className="sp-details-name">Terra Rosso</p>

              <div className="technical-features">
                <div className="feature-row">
                  <span className="feature-label">Product Code:</span>
                  <span className="feature-value">VT_237</span>
                </div>
                <div className="feature-row">
                  <span className="feature-label">Category:</span>
                  <span className="feature-value">Solid Colors</span>
                </div>
                <div className="feature-row">
                  <span className="feature-label">Surface Appearance:</span>
                  <span className="feature-value">Register Emboss 3, Natural, Serenity, Hinterland, Bute</span>
                </div>
                <div className="feature-row">
                  <span className="feature-label">Dimensions (mm):</span>
                  <span className="feature-value">1830×3660 mm, 2100×2800 mm</span>
                </div>
                <div className="feature-row">
                  <span className="feature-label">Thickness (mm):</span>
                  <span className="feature-value">8 mm, 18 mm, 25 mm</span>
                </div>
              </div>
            </div>
            <div className="sp-details-col">
              <p>Story</p>
              <p>
              The hotel lobby was meant to impress, but its walls felt mute—until the architect discovered Terra Rosso. Inspired by the blush of Tuscan rooftops at sunset, the high-gloss panel arrived at the jobsite wrapped like fine couture.
One sheet after another slid into place, and the room changed temperature: light danced, conversations rose an octave, and every passenger pulling a suitcase slowed down just to look.
By nightfall the concierge switched off half the chandeliers; the walls did the shining. Champagne flutes caught the reflection of Terra Rosso's deep red glaze, turning bubbles gold. Influencers stopped by "just for a selfie," and a month later the lobby's Instagram location had its own fan page.
</p>

              <div className="sp-date">
                <p>MDF Lam / Front Panel</p>
              </div>

              <div className="sp-link">
                <Link to="/">
                  <button>
                    <div className="icon">
                      <IoIosArrowRoundForward size={16} />
                    </div>
                    View the Product on yildizentegre.com
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="next-project">
          <div className="next-project-img">
            <img src="/stories/story1.png" alt="" />
          </div>

          <div className="container">
            <div className="next-project-header">
              <div className="next-project-icon">
                <h1>
                  <IoMdArrowForward />
                </h1>
              </div>
              <div className="next-project-title">
                <h1 style={{ marginBottom: '1rem' }}>Need to pair <strong>Terra Rosso</strong></h1>
                <h3 style={{ fontWeight: '300' }}>Try <strong>Latte Deri</strong> (complementary tone) or mirror its vibrancy with <strong>Kobalt Mavi</strong> for a couture contrast.</h3>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
};

export default Transition(Work);
