import { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [liveGoldRate, setLiveGoldRate] = useState(null);
  const [liveSilverRate, setLiveSilverRate] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesError, setRatesError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const refreshRates = () => {
    setRatesLoading(true);
    setRatesError("");

    fetch("/api/rates")
      .then((response) => {
        if (!response.ok) throw new Error("Rates API unavailable");
        return response.json();
      })
      .then((data) => {
        if (!data.success) throw new Error("Rates data unavailable");
        setLiveGoldRate(data.gold);
        setLiveSilverRate(data.silver);
        setLastUpdated(new Date());
      })
      .catch((error) => {
        console.error("Rates error:", error);
        setRatesError("Live rates temporarily unavailable");
      })
      .finally(() => {
        setRatesLoading(false);
      });
  };

  useEffect(() => {
    fetch("/api/rates")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setLiveGoldRate(data.gold);
          setLiveSilverRate(data.silver);
        }
      })
      .catch((error) => {
        console.error("Rates error:", error);
      })
      .finally(() => {
        setRatesLoading(false);
      });
  }, []);
  const [weight, setWeight] = useState("");
  const [rate, setRate] = useState("");
  const [purity, setPurity] = useState("22");
  const [making, setMaking] = useState("");
  const [wastage, setWastage] = useState("");
  const [gst, setGst] = useState("3");

  const [purityInput, setPurityInput] = useState("");
  const [purityType, setPurityType] = useState("percentage");

  const [silverWeight, setSilverWeight] = useState("");
  const [silverRate, setSilverRate] = useState("");

  const [oldWeight, setOldWeight] = useState("");
  const [oldRate, setOldRate] = useState("");
  const [oldPurity, setOldPurity] = useState("22");
  const [oldDeduction, setOldDeduction] = useState("");

  const goldValue =
    Number(weight || 0) *
    Number(rate || 0) *
    (Number(purity) / 24);

  const wastageValue =
    goldValue * (Number(wastage || 0) / 100);

  const makingValue =
    Number(weight || 0) *
    Number(making || 0);

  const subtotal =
    goldValue + wastageValue + makingValue;

  const gstValue =
    subtotal * (Number(gst || 0) / 100);

  const finalValue =
    subtotal + gstValue;

  const purityNumber = Number(purityInput || 0);

  const karat =
    purityType === "percentage"
      ? (purityNumber / 100) * 24
      : purityNumber;

  const purityPercent =
    purityType === "percentage"
      ? purityNumber
      : (purityNumber / 24) * 100;

  const fineness = purityPercent * 10;

  const silverValue =
    Number(silverWeight || 0) *
    Number(silverRate || 0);

  const oldGoldValue =
    Number(oldWeight || 0) *
    Number(oldRate || 0) *
    (Number(oldPurity) / 24);

  const oldDeductionValue =
    oldGoldValue *
    (Number(oldDeduction || 0) / 100);

  const oldFinalValue =
    oldGoldValue - oldDeductionValue;

  return (
    <div className="app">

      <nav className="navbar">
        <div className="live-rates">
  <div className="live-rate">
    <span>🥇 Gold</span>
    <strong>
      {liveGoldRate
        ? `₹${Number(liveGoldRate).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}/g`
        : "Loading..."}
    </strong>
  </div>

  <div className="live-rate">
    <span>🥈 Silver</span>
    <strong>
      {liveSilverRate
        ? `₹${Number(liveSilverRate).toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })}/g`
        : "Loading..."}
    </strong>
  </div>
</div>
        <div className="logo">GoldCalc India</div>

        <div className="nav-links">
          <span>Home</span>
          <span>Jewellery</span>
          <span>Gold Purity</span>
          <span>Silver</span>
          <span>Old Gold</span>
        </div>
      </nav>

      <main className="hero">

        <section className="intro">
          <p className="tag">
            INDIAN GOLD & JEWELLERY CALCULATOR
          </p>

          <h1>
            Calculate Your
            <span> Jewellery Value</span>
          </h1>

          <p className="description">
            Calculate gold value, jewellery price,
            purity, silver value and old gold value
            with easy-to-use tools.
          </p>
        </section>

        <section className="calculator">
          <div className="rate-controls">
            <button
              type="button"
              onClick={refreshRates}
              disabled={ratesLoading}
            >
              {ratesLoading ? "Updating..." : "🔄 Refresh Rates"}
            </button>

            {lastUpdated && (
              <small>
                Updated: {lastUpdated.toLocaleTimeString("en-IN")}
              </small>
            )}

            {ratesError && (
              <small className="rate-error">
                {ratesError}
              </small>
            )}
          </div>

          <h2>Jewellery Bill Calculator</h2>

          <label>Gold Weight (grams)</label>
          <input
            type="number"
            placeholder="Example: 10"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <label>Gold Purity</label>
          <select
            value={purity}
            onChange={(e) => setPurity(e.target.value)}
          >
            <option value="24">24K — 99.9%</option>
            <option value="22">22K — 91.6%</option>
            <option value="18">18K — 75%</option>
            <option value="14">14K — 58.5%</option>
          </select>

          <input
  type="number"
  placeholder={
    ratesLoading
      ? "Loading live gold rate..."
      : `Live rate ₹${Number(liveGoldRate || 0).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}/g`
  }
  value={rate}
  onChange={(e) => setRate(e.target.value)}
/>

{liveGoldRate && (
  <small style={{ color: "#d4af37" }}>
    Live Gold Rate: ₹
    {Number(liveGoldRate).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}/g
  </small>
)}

          <label>Making Charges (₹ per gram)</label>
          <input
            type="number"
            placeholder="Example: 500"
            value={making}
            onChange={(e) => setMaking(e.target.value)}
          />

          <label>Wastage (%)</label>
          <input
            type="number"
            placeholder="Example: 5"
            value={wastage}
            onChange={(e) => setWastage(e.target.value)}
          />

          <label>GST (%)</label>
          <input
            type="number"
            value={gst}
            onChange={(e) => setGst(e.target.value)}
          />

          <div className="result">
            <small>Estimated Final Jewellery Price</small>
            <strong>
              ₹ {finalValue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="breakdown">
            <p>Gold Value: ₹ {goldValue.toLocaleString("en-IN")}</p>
            <p>Wastage: ₹ {wastageValue.toLocaleString("en-IN")}</p>
            <p>Making: ₹ {makingValue.toLocaleString("en-IN")}</p>
            <p>GST: ₹ {gstValue.toLocaleString("en-IN")}</p>
          </div>

        </section>
      </main>

      <section className="tools">

        <div className="tool-card">
          <p className="tag">GOLD PURITY TOOL</p>

          <h2>Gold Purity Calculator</h2>

          <p className="description">
            Convert gold purity percentage into Karat and fineness.
          </p>

          <select
            value={purityType}
            onChange={(e) => setPurityType(e.target.value)}
          >
            <option value="percentage">Enter Purity %</option>
            <option value="karat">Enter Karat</option>
          </select>

          <input
            type="number"
            placeholder={
              purityType === "percentage"
                ? "Example: 91.6"
                : "Example: 22"
            }
            value={purityInput}
            onChange={(e) => setPurityInput(e.target.value)}
          />

          <div className="purity-result">
            <p>
              Karat
              <strong>{karat ? karat.toFixed(2) : "—"}K</strong>
            </p>

            <p>
              Purity
              <strong>
                {purityPercent
                  ? purityPercent.toFixed(2)
                  : "—"}%
              </strong>
            </p>

            <p>
              Fineness
              <strong>{fineness ? fineness.toFixed(0) : "—"}</strong>
            </p>
          </div>
        </div>

        <div className="tool-card">
          <p className="tag">SILVER CALCULATOR</p>

          <h2>Silver Value Calculator</h2>

          <p className="description">
            Calculate estimated silver value using weight and rate.
          </p>

          <label>Silver Weight (grams)</label>
          <input
            type="number"
            placeholder="Example: 100"
            value={silverWeight}
            onChange={(e) => setSilverWeight(e.target.value)}
          />

          <input
  type="number"
  placeholder={
    ratesLoading
      ? "Loading live silver rate..."
      : `Live rate ₹${Number(liveSilverRate || 0).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}/g`
  }
  value={silverRate}
  onChange={(e) => setSilverRate(e.target.value)}
/>

{liveSilverRate && (
  <small style={{ color: "#d4af37" }}>
    Live Silver Rate: ₹
    {Number(liveSilverRate).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}/g
  </small>
)}

          <div className="result">
            <small>Estimated Silver Value</small>
            <strong>
              ₹ {silverValue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>
        </div>

        <div className="tool-card">
          <p className="tag">OLD GOLD CALCULATOR</p>

          <h2>Old Gold Value Calculator</h2>

          <p className="description">
            Estimate the value of old gold based on weight, purity and rate.
          </p>

          <label>Old Gold Weight (grams)</label>
          <input
            type="number"
            placeholder="Example: 10"
            value={oldWeight}
            onChange={(e) => setOldWeight(e.target.value)}
          />

          <label>Gold Purity</label>
          <select
            value={oldPurity}
            onChange={(e) => setOldPurity(e.target.value)}
          >
            <option value="24">24K — 99.9%</option>
            <option value="22">22K — 91.6%</option>
            <option value="18">18K — 75%</option>
            <option value="14">14K — 58.5%</option>
          </select>

          <label>Gold Rate (₹ per gram)</label>
          <input
            type="number"
            placeholder="Example: 10000"
            value={oldRate}
            onChange={(e) => setOldRate(e.target.value)}
          />

          <label>Deduction (%)</label>
          <input
            type="number"
            placeholder="Example: 2"
            value={oldDeduction}
            onChange={(e) => setOldDeduction(e.target.value)}
          />

          <div className="result">
            <small>Estimated Old Gold Value</small>
            <strong>
              ₹ {oldFinalValue.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </strong>
          </div>

          <div className="breakdown">
            <p>
              Gross Value: ₹ {oldGoldValue.toLocaleString("en-IN")}
            </p>

            <p>
              Deduction: ₹ {oldDeductionValue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

      </section>

      <section className="info">

        <h2>GoldCalc India</h2>

        <p>
          Free gold, silver and jewellery calculation tools for India.
        </p>

        <div className="features">

          <div>
            <h3>Gold Calculator</h3>
            <p>
              Calculate jewellery value, making charges and GST.
            </p>
          </div>

          <div>
            <h3>Gold Purity</h3>
            <p>
              Convert Karat, percentage and fineness.
            </p>
          </div>

          <div>
            <h3>Silver Calculator</h3>
            <p>
              Calculate silver value from weight and rate.
            </p>
          </div>

        </div>
      </section>

      <section className="seo-links">
        <h2>Popular Gold & Silver Calculators</h2>
        <ul>
          <li><a href="/18k-gold-calculator/">18K Gold Calculator</a></li>
          <li><a href="/22k-gold-calculator/">22K Gold Calculator</a></li>
          <li><a href="/24k-gold-calculator/">24K Gold Calculator</a></li>
          <li><a href="/silver-calculator/">Silver Calculator</a></li>
          <li><a href="/old-gold-calculator/">Old Gold Calculator</a></li>
          <li><a href="/gold-purity-calculator/">Gold Purity Calculator</a></li>
        </ul>
      </section>

      <section className="faq">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-item">
          <h3>What is a Gold Calculator?</h3>
          <p>
            GoldCalc India helps you estimate jewellery value using gold weight,
            purity, gold rate, making charges, wastage and GST.
          </p>
        </div>

        <div className="faq-item">
          <h3>How is 22K gold price calculated?</h3>
          <p>
            The estimated value depends on the gold weight, current gold rate
            and 22K purity, along with applicable jewellery charges and GST.
          </p>
        </div>

        <div className="faq-item">
          <h3>Can I calculate silver value?</h3>
          <p>
            Yes. Enter the silver weight and silver rate to estimate the value
            of your silver.
          </p>
        </div>

        <div className="faq-item">
          <h3>Can I calculate old gold value?</h3>
          <p>
            Yes. GoldCalc India includes an old gold calculator for estimating
            gross value and deduction based on the details you enter.
          </p>
        </div>

        <div className="faq-item">
          <h3>Is the calculated jewellery price exact?</h3>
          <p>
            No. The calculator provides an estimate. Final jewellery prices
            may vary depending on the jeweller, market rate, making charges,
            taxes and other applicable charges.
          </p>
        </div>
      </section>

      <footer>
        <p>© 2026 GoldCalc India</p>
        <p>Calculations are estimates only.</p>

        <nav className="footer-links" aria-label="Footer navigation">
          <a href="/about/">About</a>
          <a href="/contact/">Contact</a>
          <a href="/privacy-policy/">Privacy Policy</a>
          <a href="/terms/">Terms &amp; Conditions</a>
        </nav>
      </footer>

    </div>
  );
}

export default App;
