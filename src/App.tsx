import React, { useState, useEffect, useRef } from 'react';
import { StellarWalletsKit } from '@lumenkit/stellar-wallets/build/stellar-wallets-kit';
import { WalletNetwork, IModalTheme, IButtonTheme } from '@lumenkit/stellar-wallets/build/types';
import { ModalThemes } from '@lumenkit/stellar-wallets/build/components/modal/stellar-wallets-modal';
import { ButtonThemes } from '@lumenkit/stellar-wallets/build/components/button/stellar-wallets-button';
import { StellarReviewTransactionButton } from '@lumenkit/stellar-wallets/build/components/review-transaction-button/stellar-review-transaction-button';
import { StellarReviewTransactionModal } from '@lumenkit/stellar-wallets/build/components/review-transaction-modal/stellar-review-transaction-modal';
import { FreighterModule } from '@lumenkit/stellar-wallets/build/modules/freighter.module';
import { AlbedoModule } from '@lumenkit/stellar-wallets/build/modules/albedo.module';
import { RabetModule } from '@lumenkit/stellar-wallets/build/modules/rabet.module';
import { LobstrModule } from '@lumenkit/stellar-wallets/build/modules/lobstr.module';
import { xBullModule } from '@lumenkit/stellar-wallets/build/modules/xbull.module';
import { HanaModule } from '@lumenkit/stellar-wallets/build/modules/hana.module';
import { HotWalletModule } from '@lumenkit/stellar-wallets/build/modules/hotwallet.module';
import { KleverModule } from '@lumenkit/stellar-wallets/build/modules/klever.module';

const App: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<WalletNetwork>(WalletNetwork.TESTNET);

  const buttonWrapperRef = useRef<HTMLDivElement>(null);
  const networkSelectorRef = useRef<HTMLDivElement>(null);
  const reviewButtonRef = useRef<HTMLDivElement>(null);
  const reviewModalRef = useRef<HTMLDivElement>(null);

  // Initialize LumenKit
  useEffect(() => {
    // Register custom elements
    if (!customElements.get('stellar-review-transaction-button')) {
      customElements.define('stellar-review-transaction-button', StellarReviewTransactionButton);
    }
    if (!customElements.get('stellar-review-transaction-modal')) {
      customElements.define('stellar-review-transaction-modal', StellarReviewTransactionModal);
    }

    const initializeKit = async () => {
      try {
        const modules = [
          new FreighterModule(),
          new AlbedoModule(),
          new RabetModule(),
          new LobstrModule(),
          new xBullModule(),
          new HanaModule(),
          new HotWalletModule(),
          new KleverModule(),
        ];

        const modalTheme: IModalTheme = {
          ...ModalThemes.DARK,
          bgColor: '#1a1a1a',
          textColor: '#ffffff',
          solidTextColor: '#ffffff',
          headerButtonColor: '#fdda24',
          dividerColor: '#333333',
          helpBgColor: '#2a2a2a',
          notAvailableTextColor: '#ff6b6b',
          notAvailableBgColor: '#2a2a2a',
          notAvailableBorderColor: '#ff6b6b',
        };

        const buttonTheme: IButtonTheme = {
          ...ButtonThemes.DARK,
          bgColor: '#fdda24',
          textColor: '#0f0f0f',
          solidTextColor: '#0f0f0f',
          dividerColor: '#333333',
          buttonPadding: '12px 24px',
          buttonBorderRadius: '8px',
        };

        const stellarKit = new StellarWalletsKit({
          network: selectedNetwork,
          modules,
          modalTheme,
          buttonTheme,
        });

        // Get supported wallets (for future use)
        await stellarKit.getSupportedWallets();

        // Create native components
        createNativeComponents(stellarKit);
      } catch (err) {
        console.error(`Failed to initialize LumenKit: ${err}`);
      }
    };

    const createNativeComponents = async (kit: StellarWalletsKit) => {
      try {
        if (networkSelectorRef.current && !networkSelectorRef.current.hasChildNodes()) {
          const networkButton = document.createElement('stellar-network-selector-button');
          networkButton.setAttribute('networkName', 'Stellar Testnet');
          networkButton.setAttribute('selectedNetwork', 'testnet');
          networkSelectorRef.current.appendChild(networkButton);

          networkButton.addEventListener('network-changed', (event: any) => {
            const { networkId } = event.detail;

            const newNetwork = networkId === 'mainnet' ? WalletNetwork.PUBLIC :
              networkId === 'testnet' ? WalletNetwork.TESTNET :
                WalletNetwork.FUTURENET;

            setSelectedNetwork(newNetwork);
          });
        }

        if (buttonWrapperRef.current && !buttonWrapperRef.current.hasChildNodes()) {
          await kit.createButton({
            container: buttonWrapperRef.current,
            onConnect: ({ }) => {
              setIsConnected(true);
            },
            onDisconnect: () => {
              setIsConnected(false);
            },
            buttonText: 'Connect Wallet',
            horizonUrl: selectedNetwork === WalletNetwork.TESTNET ?
              'https://horizon-testnet.stellar.org' :
              'https://horizon.stellar.org'
          });
        }

        if (reviewButtonRef.current && !reviewButtonRef.current.hasChildNodes()) {
          const reviewButton = document.createElement('stellar-review-transaction-button');
          reviewButton.setAttribute('buttonText', 'Show Audit Example');
          reviewButtonRef.current.appendChild(reviewButton);

          reviewButton.addEventListener('review-transaction-clicked', () => {
            if (reviewModalRef.current) {
              const modal = reviewModalRef.current.querySelector('stellar-review-transaction-modal') as any;
              if (modal) {
                modal.showModal = true;
                modal.setAttribute('showModal', 'true');
              }
            }
          });
        }

        if (reviewModalRef.current && !reviewModalRef.current.hasChildNodes()) {
          const reviewModal = document.createElement('stellar-review-transaction-modal') as any;
          reviewModal.setAttribute('showModal', 'false');
          reviewModal.showModal = false;
          reviewModalRef.current.appendChild(reviewModal);

          reviewModal.addEventListener('modal-closed', () => {
            reviewModal.showModal = false; 
          });
        }
      } catch (err) {
        console.error('Failed to create native components:', err);
      }
    };

    initializeKit();
  }, []);

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: 0,
      padding: 0,
      backgroundColor: '#f6f7f8',
      minHeight: '100vh',
      width: '100%'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 1.5rem',
        width: '100%'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f0f0f' }}>LUMEN</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f0f0f' }}>Kit</div>
          </div>
          <nav style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="hidden md:flex">
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Features</a>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>AI Audit</a>
            <a href="#" style={{ color: '#4b5563', textDecoration: 'none', fontWeight: '500' }}>Docs</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Network Selector - Only show when connected */}
            <div
              ref={networkSelectorRef}
              style={{
                transition: 'all 0.3s ease-in-out',
                opacity: isConnected ? 1 : 0,
                transform: isConnected ? 'translateX(0)' : 'translateX(10px)',
                pointerEvents: isConnected ? 'auto' : 'none',
                position: 'relative',
                zIndex: 1000
              }}
            />

            {/* Wallet Button */}
            <div ref={buttonWrapperRef} style={{ marginRight: '3rem' }} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '4rem 0.5rem', width: '100%' }}>
        <div style={{ width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
            width: '100%',
            padding: '0 2rem'
          }}>
            <div>
              <div style={{
                backgroundColor: '#fdda24',
                color: '#0f0f0f',
                fontWeight: '600',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                display: 'inline-block',
                marginBottom: '2rem',
                fontSize: '0.875rem'
              }}>
                CREATED BY STELLAR
              </div>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: '#0f0f0f',
                lineHeight: '1.1',
                marginBottom: '1.5rem',
                margin: 0
              }}>
                The First<br />
                Wallet Kit with<br />
                AI Auditing
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: '#4b5563',
                marginBottom: '2rem',
                maxWidth: '28rem',
                lineHeight: '1.6'
              }}>
                Stop signing blind. LumenKit brings AI-powered transaction auditing to Stellar, turning scary code into
                clear explanations.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {/* Review Transaction Button */}
                  <div ref={reviewButtonRef} />
                  <button style={{
                    backgroundColor: 'transparent',
                    color: '#4b5563',
                    fontWeight: '500',
                    padding: '0.75rem 2rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #4b5563',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}>
                    View on GitHub
                  </button>
                </div>
              </div>
            </div>
            <div style={{
              position: 'relative', right: '4rem'
            }}>
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '1.5rem',
                transform: 'rotate(3deg)',
                right: '4rem'
              }}>
                <div style={{
                  backgroundColor: '#fdda24',
                  color: '#0f0f0f',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}>
                  WHAT YOU'RE SIGNING:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { icon: 'P', color: '#7c3aed', title: 'Payment', desc: 'Send 100 XLM to John' },
                    { icon: 'L', color: '#00a7b5', title: 'Liquidity', desc: 'Add liquidity to pool' },
                    { icon: 'A', color: '#ef4444', title: 'Assets', desc: 'Create new asset' },
                    { icon: 'M', color: '#3b82f6', title: 'Multisig', desc: 'Update account signers' },
                    { icon: 'P', color: '#10b981', title: 'Path', desc: 'Find payment path' }
                  ].map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      backgroundColor: '#f6f7f8',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        backgroundColor: item.color,
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.875rem'
                      }}>
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#0f0f0f' }}>{item.title}</div>
                        <div style={{ fontSize: '0.875rem', color: '#4b5563' }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '4rem',
                backgroundColor: '#fdda24',
                color: '#0f0f0f',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                transform: 'rotate(-12deg)'
              }}>
                NO SCAM RISK
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ backgroundColor: '#fdda24', padding: '4rem 0.5rem', width: '100%' }}>
        <div style={{ width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            textAlign: 'center',
            width: '100%'
          }}>
            {[
              { title: '5 MIN SETUP', desc: 'npm install, import, done.' },
              { title: 'AI EXPLAINS ALL', desc: 'Every transaction explained in human language.' },
              { title: 'SCAM SHIELD', desc: 'Catches sketchy contracts before they catch you.' }
            ].map((feature, index) => (
              <div key={index}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: '#fdda24',
                    borderRadius: '50%'
                  }}></div>
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#0f0f0f',
                  marginBottom: '0.5rem'
                }}>{feature.title}</h3>
                <p style={{ color: '#0f0f0f' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything You Need Section */}
      <section style={{ padding: '4rem 0.5rem', width: '100%' }}>
        <div style={{ width: '100%' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#0f0f0f',
            marginBottom: '4rem'
          }}>
            EVERYTHING YOU NEED
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            width: '100%'
          }}>
            {[
              { icon: '⚡', color: '#fdda24', title: '5-Minute Setup' },
              { icon: '🎨', color: '#00a7b5', title: 'Fully Customizable' },
              { icon: '💼', color: '#b7ace8', title: 'All Stellar Wallets' },
              { icon: '📱', color: '#fdda24', title: 'Mobile Ready' },
              { icon: '🌐', color: '#00a7b5', title: 'Multi-Network' },
              { icon: '📊', color: '#3b82f6', title: 'Transaction History' }
            ].map((item, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  backgroundColor: item.color,
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.25rem'
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#0f0f0f',
                  margin: 0
                }}>{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ backgroundColor: '#fdda24', padding: '4rem 0.5rem', width: '100%' }}>
        <div style={{ width: '100%' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            textAlign: 'center',
            width: '100%'
          }}>
            {[
              { number: '98%', text: 'PREVENTION FROM SCAM' },
              { number: '6+', text: 'WALLETS SUPPORTED' },
              { number: '24/7', text: 'AI PROTECTION' }
            ].map((stat, index) => (
              <div key={index}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: '#0f0f0f',
                  marginBottom: '0.5rem'
                }}>{stat.number}</div>
                <p style={{ color: '#0f0f0f', fontWeight: '600' }}>{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4rem 0.5rem', width: '100%' }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#0f0f0f',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            READY TO MAKE<br />
            STELLAR SAFER?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#4b5563',
            marginBottom: '2rem'
          }}>
            Join the revolution. Your users will thank you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              backgroundColor: '#fdda24',
              color: '#0f0f0f',
              fontWeight: '600',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Start Building →
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: '#4b5563',
              fontWeight: '500',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: '1px solid #4b5563',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Read Docs
            </button>
          </div>
          <p style={{
            fontSize: '0.875rem',
            color: '#4b5563',
            marginTop: '2rem'
          }}>
            Built with ❤️ for HackStellar 2024 in 48h
          </p>
        </div>
      </section>

      {/* Final CTA Section */}
      <section style={{ backgroundColor: '#0f0f0f', padding: '4rem 0.5rem', width: '100%' }}>
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1.5rem'
          }}>
            START BUILDING TODAY
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#e5e7eb',
            marginBottom: '2rem'
          }}>
            Join developers building the future of Stellar with better UX and AI-powered security.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              backgroundColor: '#fdda24',
              color: '#0f0f0f',
              fontWeight: '600',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              Get Started →
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              fontWeight: '500',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: '1px solid white',
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              View on GitHub
            </button>
          </div>
        </div>
      </section>

      {/* Review Transaction Modal */}
      <div ref={reviewModalRef} />
    </div>
  );
};

export default App;
