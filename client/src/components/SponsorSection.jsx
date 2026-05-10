import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import { Wallet, Apple, Map, HeartHandshake, ShieldCheck, Package, BookOpen, GraduationCap, Sparkles } from 'lucide-react';
import styles from '../styles/SponsorSection.module.css';

const SponsorSection = () => {
  const { openDonationModal } = useStore();
  const navigate = useNavigate();

  // 1. Money Card State
  const [moneyAmount, setMoneyAmount] = useState('1000');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const moneyGoal = 500000;

  const handlePresetMoney = (amount) => {
    setMoneyAmount(amount.toString());
    setIsCustomAmount(false);
  };

  const handleCustomMoneyChange = (e) => {
    setMoneyAmount(e.target.value);
    setIsCustomAmount(true);
  };

  // 2. Snacks Card State
  const [mealItems, setMealItems] = useState({
    Samosa: { price: 15, qty: 0 },
    'Cold Drink': { price: 20, qty: 0 },
    Fruit: { price: 10, qty: 0 },
    'Fruit Juice': { price: 25, qty: 0 },
    Biscuits: { price: 10, qty: 0 }
  });

  const handleMealChange = (item, delta) => {
    setMealItems(prev => ({
      ...prev,
      [item]: { ...prev[item], qty: Math.max(0, prev[item].qty + delta) }
    }));
  };

  const totalMealCost = Object.values(mealItems).reduce((sum, item) => sum + (item.price * item.qty), 0);

  // 3. Activity Card State
  const [activityType, setActivityType] = useState('Local Picnic');
  
  const activityTypes = [
    'Local Picnic',
    'City Library Visit',
    'Historical Fort Visit',
    'Science Museum Trip'
  ];

  // 4. Elderly Card State
  const [elderlyTier, setElderlyTier] = useState('Care');
  
  const elderlyTiers = {
    'Basic': { price: 500, covers: 'Provides weekly meals for 1 elder.' },
    'Care': { price: 1500, covers: 'Provides monthly medicines & meals for 1 elder.' },
    'Premium': { price: 5000, covers: 'Full medical, nutritional, and companionship support for 1 elder per month.' }
  };

  // 5. Goods Card State
  const [goodsCategory, setGoodsCategory] = useState('Clothes');
  const goodsCategories = ['Clothes', 'Toys & Games', 'Books & Stationery', 'Winter Blankets'];

  // 6. Sponsor a Student State
  const [studentMonths, setStudentMonths] = useState(1);
  const perStudentMonth = 300;

  // 7. Book Pack State
  const [bookPackQty, setBookPackQty] = useState(1);
  const perBookPack = 150;

  // 8. Festival State
  const [festivalKids, setFestivalKids] = useState(5);
  const perFestivalKid = 50;

  return (
    <section className={styles.sponsorSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>Make an Impact Today</h2>
          <p className={styles.tagline}>
            Choose how you want to help. 100% of your donation goes directly towards our ground initiatives in Orai.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {/* Card 1: Donate Money */}
          <div className={styles.donationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}><Wallet size={28} /></div>
              <h3 className={styles.cardTitle}>Donate Money</h3>
            </div>
            
            <div className={styles.cardBody}>
              <p className={styles.impactText}>General fund for our most urgent needs.</p>
              
              <div className={styles.presetGrid}>
                {[100, 500, 1000, 5000].map(amt => (
                  <button 
                    key={amt} 
                    className={`${styles.presetBtn} ${!isCustomAmount && moneyAmount === amt.toString() ? styles.active : ''}`}
                    onClick={() => handlePresetMoney(amt)}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className={styles.customInputWrapper}>
                <span className={styles.currencySymbol}>₹</span>
                <input 
                  type="number" 
                  className={styles.customInput} 
                  placeholder="Custom Amount" 
                  value={moneyAmount} 
                  onChange={handleCustomMoneyChange}
                />
              </div>

              <div className={styles.progressContainer}>
                <div className={styles.progressHeader}>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Be the first to donate! 🙏</span>
                  <span style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.85rem' }}>Goal: ₹{moneyGoal.toLocaleString()}</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '0%' }}></div>
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '6px' }}>₹0 raised so far</div>
              </div>
            </div>

            <div className={styles.ctaWrapper}>
              <button className={styles.donateBtn} onClick={openDonationModal}>
                <ShieldCheck size={18} /> Donate ₹{moneyAmount || '0'}
              </button>
            </div>
          </div>

          {/* Card 2: Donate Snacks */}
          <div className={styles.donationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}><Apple size={28} /></div>
              <h3 className={styles.cardTitle}>Sponsor Snacks</h3>
            </div>
            
            <div className={styles.cardBody}>
              <p className={styles.impactText}>Build a customized snack pack for the children.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.keys(mealItems).map(item => (
                  <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: '500', color: 'var(--text)' }}>
                      {item} <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>(₹{mealItems[item].price})</span>
                    </div>
                    <div className={styles.stepperControl} style={{ width: '100px', padding: '2px' }}>
                      <button className={styles.stepBtn} style={{ width: '28px', height: '28px', fontSize: '1rem' }} onClick={() => handleMealChange(item, -1)}>-</button>
                      <span className={styles.stepValue} style={{ fontSize: '1rem' }}>{mealItems[item].qty}</span>
                      <button className={styles.stepBtn} style={{ width: '28px', height: '28px', fontSize: '1rem' }} onClick={() => handleMealChange(item, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.ctaWrapper}>
              <div className={styles.totalPreview}>Total: ₹{totalMealCost}</div>
              <button 
                className={styles.donateBtn} 
                onClick={() => {
                  if (totalMealCost < 100) {
                    import('react-hot-toast').then(({ default: toast }) => toast.error('Please select at least ₹100 worth of snacks'));
                    return;
                  }
                  openDonationModal(totalMealCost);
                }}
              >
                <ShieldCheck size={18} /> Sponsor Snacks — ₹{totalMealCost}
              </button>
            </div>
          </div>

          {/* Card 3: Host a Trip */}
          <div className={styles.donationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}><Map size={28} /></div>
              <h3 className={styles.cardTitle}>Host a Trip</h3>
            </div>
            
            <div className={styles.cardBody}>
              <p className={styles.impactText}>Volunteer to take our children on an educational trip or local tour.</p>
              
              <select 
                className={styles.dropdown} 
                value={activityType} 
                onChange={(e) => setActivityType(e.target.value)}
              >
                {activityTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <div className={styles.tierCoverage} style={{marginTop: '0'}}>
                Speak directly with the NGO to plan and organize a wonderful day out for the children.
              </div>
            </div>

            <div className={styles.ctaWrapper}>
              <button className={styles.donateBtn} onClick={() => navigate('/contact')} style={{ background: 'var(--secondary)', color: 'var(--dark)' }}>
                <Map size={18} /> Organize a Trip
              </button>
            </div>
          </div>

          {/* Card 4: Support the Elderly */}
          <div className={styles.donationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}><HeartHandshake size={28} /></div>
              <h3 className={styles.cardTitle}>Support the Elderly</h3>
            </div>
            
            <div className={styles.cardBody}>
              <p className={styles.impactText}>Ensure our senior citizens live with dignity.</p>
              
              <div className={styles.tierGrid}>
                {Object.keys(elderlyTiers).map(tier => (
                  <button 
                    key={tier}
                    className={`${styles.tierBtn} ${elderlyTier === tier ? styles.active : ''}`}
                    onClick={() => setElderlyTier(tier)}
                  >
                    <span>{tier}</span>
                    <span>₹{elderlyTiers[tier].price}/mo</span>
                  </button>
                ))}
              </div>
              <div className={styles.tierCoverage}>
                {elderlyTiers[elderlyTier].covers}
              </div>
            </div>

            <div className={styles.ctaWrapper}>
              <button className={styles.donateBtn} onClick={() => openDonationModal(elderlyTiers[elderlyTier].price)}>
                <ShieldCheck size={18} /> Support ({elderlyTier}) — ₹{elderlyTiers[elderlyTier].price}
              </button>
            </div>
          </div>

          {/* Card 5: Donate Clothes & Toys */}
          <div className={styles.donationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}><Package size={28} /></div>
              <h3 className={styles.cardTitle}>Donate In-Kind</h3>
            </div>
            
            <div className={styles.cardBody}>
              <p className={styles.impactText}>Give your gently used items a second life.</p>
              
              <select 
                className={styles.dropdown} 
                value={goodsCategory} 
                onChange={(e) => setGoodsCategory(e.target.value)}
              >
                {goodsCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <div className={styles.tierCoverage} style={{marginTop: '0'}}>
                Our volunteers will contact you to schedule a pickup from your location in Orai.
              </div>
            </div>

            <div className={styles.ctaWrapper}>
              <button className={styles.donateBtn} onClick={() => navigate('/contact')} style={{ background: 'var(--secondary)', color: 'var(--dark)' }}>
                <Package size={18} /> Schedule Pickup
              </button>
            </div>
          </div>

          {/* Card 6: Sponsor a Student */}
          <div className={styles.donationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}><GraduationCap size={28} /></div>
              <h3 className={styles.cardTitle}>Sponsor a Student</h3>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.impactText}>Cover a child's monthly education expenses — notebooks, pens, and learning materials.</p>
              <div style={{ textAlign: 'center', margin: '16px 0 8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>₹{studentMonths * perStudentMonth}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>for {studentMonths} month{studentMonths > 1 ? 's' : ''}</div>
              </div>
              <div className={styles.stepperControl} style={{ margin: '0 auto', width: '130px' }}>
                <button className={styles.stepBtn} onClick={() => setStudentMonths(m => Math.max(1, m - 1))}>-</button>
                <span className={styles.stepValue}>{studentMonths}</span>
                <button className={styles.stepBtn} onClick={() => setStudentMonths(m => Math.min(12, m + 1))}>+</button>
              </div>
              <div className={styles.tierCoverage}>₹{perStudentMonth}/month provides all essential stationery for 1 child.</div>
            </div>
            <div className={styles.ctaWrapper}>
              <button className={styles.donateBtn} onClick={() => openDonationModal(studentMonths * perStudentMonth)}>
                <ShieldCheck size={18} /> Sponsor — ₹{studentMonths * perStudentMonth}
              </button>
            </div>
          </div>

          {/* Card 7: Donate a Book Pack */}
          <div className={styles.donationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}><BookOpen size={28} /></div>
              <h3 className={styles.cardTitle}>Donate a Book Pack</h3>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.impactText}>Sponsor a complete book & stationery kit for a child who can't afford them.</p>
              <div style={{ textAlign: 'center', margin: '16px 0 8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>₹{bookPackQty * perBookPack}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{bookPackQty} book pack{bookPackQty > 1 ? 's' : ''}</div>
              </div>
              <div className={styles.stepperControl} style={{ margin: '0 auto', width: '130px' }}>
                <button className={styles.stepBtn} onClick={() => setBookPackQty(q => Math.max(1, q - 1))}>-</button>
                <span className={styles.stepValue}>{bookPackQty}</span>
                <button className={styles.stepBtn} onClick={() => setBookPackQty(q => q + 1)}>+</button>
              </div>
              <div className={styles.tierCoverage}>Each ₹{perBookPack} pack includes notebooks, pens, pencils & an eraser.</div>
            </div>
            <div className={styles.ctaWrapper}>
              <button className={styles.donateBtn} onClick={() => openDonationModal(bookPackQty * perBookPack)}>
                <ShieldCheck size={18} /> Donate — ₹{bookPackQty * perBookPack}
              </button>
            </div>
          </div>

          {/* Card 8: Sponsor a Festival */}
          <div className={styles.donationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}><Sparkles size={28} /></div>
              <h3 className={styles.cardTitle}>Sponsor a Festival</h3>
            </div>
            <div className={styles.cardBody}>
              <p className={styles.impactText}>Help us bring joy to children by funding celebrations like Holi, Diwali & more.</p>
              <div style={{ textAlign: 'center', margin: '16px 0 8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>₹{festivalKids * perFestivalKid}</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>for {festivalKids} child{festivalKids > 1 ? 'ren' : ''}</div>
              </div>
              <div className={styles.stepperControl} style={{ margin: '0 auto', width: '130px' }}>
                <button className={styles.stepBtn} onClick={() => setFestivalKids(k => Math.max(1, k - 1))}>-</button>
                <span className={styles.stepValue}>{festivalKids}</span>
                <button className={styles.stepBtn} onClick={() => setFestivalKids(k => k + 1)}>+</button>
              </div>
              <div className={styles.tierCoverage}>₹{perFestivalKid}/child covers colors, sweets & a gift for the festival.</div>
            </div>
            <div className={styles.ctaWrapper}>
              <button className={styles.donateBtn} onClick={() => openDonationModal(festivalKids * perFestivalKid)}>
                <ShieldCheck size={18} /> Sponsor — ₹{festivalKids * perFestivalKid}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorSection;
