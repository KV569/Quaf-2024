 // Security and anti-cheat system
        let isQuizActive = false;
        let isFullscreenLocked = false;
        let securityViolated = false;
        
        // Anti-cheat detection functions
        function showCheatAlert() {
            if (securityViolated) return;
            
            securityViolated = true;
            isQuizActive = false;
            
            // Clear any running timers
            if (currentQuiz.timer) {
                clearInterval(currentQuiz.timer);
            }
            
            // Show the cheat alert screen
            document.getElementById('cheat-alert').classList.add('active');
            
            // Force exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            // Auto-redirect to login after 5 seconds
            setTimeout(() => {
                resetToLogin();
            }, 5000);
        }
        
        function resetToLogin() {
            securityViolated = false;
            isQuizActive = false;
            isFullscreenLocked = false;
            document.getElementById('cheat-alert').classList.remove('active');
            
            // Reset quiz state
            currentQuiz = {
                subjectId: '',
                questions: [],
                currentQuestionIndex: 0,
                score: 0,
                answers: [],
                timer: null
            };
            
            showPage('login-page');
        }
        
        // Fullscreen management
        function enterFullscreen() {
            const elem = document.documentElement;
            
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
            
            isFullscreenLocked = true;
        }
        
        function checkFullscreen() {
            if (!isQuizActive) return;
            
            const isFullscreen = !!(document.fullscreenElement || 
                                   document.webkitFullscreenElement || 
                                   document.mozFullScreenElement || 
                                   document.msFullscreenElement);
            
            if (isFullscreenLocked && !isFullscreen) {
                showCheatAlert();
            }
        }
        
        // Security event listeners
        function setupSecurityListeners() {
            // Disable right-click context menu
            document.addEventListener('contextmenu', function(e) {
                if (isQuizActive) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            });
            
            // Block keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (!isQuizActive) return;
                
                // Block F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C, etc.
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
                    (e.ctrlKey && e.key === 'u') ||
                    (e.ctrlKey && e.key === 'U') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'K') ||
                    e.key === 'F5' ||
                    (e.ctrlKey && e.key === 'r') ||
                    (e.ctrlKey && e.key === 'R')) {
                    e.preventDefault();
                    e.stopPropagation();
                    showCheatAlert();
                    return false;
                }
                
                // Block Alt+Tab, Ctrl+Tab, Windows key, etc.
                if ((e.altKey && e.key === 'Tab') ||
                    (e.ctrlKey && e.key === 'Tab') ||
                    e.key === 'Meta' ||
                    e.key === 'Alt') {
                    e.preventDefault();
                    e.stopPropagation();
                    showCheatAlert();
                    return false;
                }
            });
            
            // Detect window focus changes
            window.addEventListener('focus', function() {
                if (isQuizActive && isFullscreenLocked) {
                    // Ensure fullscreen is maintained
                    setTimeout(checkFullscreen, 100);
                }
            });
            
            window.addEventListener('blur', function() {
                if (isQuizActive) {
                    showCheatAlert();
                }
            });
            
            // Detect visibility changes (tab switching)
            document.addEventListener('visibilitychange', function() {
                if (isQuizActive && document.hidden) {
                    showCheatAlert();
                }
            });
            
            // Detect fullscreen changes
            document.addEventListener('fullscreenchange', checkFullscreen);
            document.addEventListener('webkitfullscreenchange', checkFullscreen);
            document.addEventListener('mozfullscreenchange', checkFullscreen);
            document.addEventListener('MSFullscreenChange', checkFullscreen);
            
            // Mouse leave detection
            document.addEventListener('mouseleave', function() {
                if (isQuizActive) {
                    showCheatAlert();
                }
            });
            
            // Prevent text selection during quiz
            document.addEventListener('selectstart', function(e) {
                if (isQuizActive) {
                    e.preventDefault();
                }
            });
            
            // Detect minimize attempts
            window.addEventListener('resize', function() {
                if (isQuizActive && (window.outerHeight - window.innerHeight > 100)) {
                    showCheatAlert();
                }
            });
        }
    
      // Question dataset
        const subjectQuestions = {
            // 1. Qur'an 
            "1": [
                {
                    question: "ഖുർആൻ അവതരിച്ചത് എത്ര കാലം കൊണ്ട്?",
                    options: ["20", "22", "23"],
                    correctAnswer: 2
                },
                {
                    question: "ഖുർആനിൽ ആകെ എത്ര സൂറത്തുകൾ ഉണ്ട്?",
                    options: ["111", "114", "117"],
                    correctAnswer: 1
                },
                {
                    question: "ഖുർആൻ അവതരണത്തിന്റെ മുമ്പ്  അത് രേഖപ്പെടുത്തിയിരുന്നത് എവിടെ?",
                    options: ["ആകാശത്ത്", "ലൗഹുൽ മഹ്ഫൂളിൽ", "ഭൂമിയിൽ"],
                    correctAnswer: 1
                },
                {
                    question: "ഖുർആനിൽ ആദ്യമായി അവതരിച്ച ആയത്ത് ഏത് സൂറത്തിലാണ്?",
                    options: ["അലഖ്", "മുദസിർ", "ബഖറ"],
                    correctAnswer: 0
                },
                {
                    question: "ഒരു സൂറത്തായി ഒന്നിച്ച് പൂര്‍ണ്ണമായി  അവതരിച്ച സൂറത്ത് ?",
                    options: ["മുസ്സമിൽ", "കൗസർ", "മുദസിർ"],
                    correctAnswer: 2
                },
                {
                    question: "ഖുർആനിലെ ഏറ്റവും മഹത്വമുള്ള സൂറത്ത്?",
                    options: ["മുൽക്", "ഫാത്തിഹ", "യാസീൻ"],
                    correctAnswer: 1
                },
                {
                    question: "ഖുർആനിലെ ഏറ്റവും ചെറിയ സൂറത്ത്?",
                    options: ["അസ്ർ", "കൗസർ", "ഇഖ്ലാസ്"],
                    correctAnswer: 1
                },
                {
                    question: "എല്ലാ ആയത്തിലും അല്ലാഹു എന്ന പദമുള്ള സൂറത്ത്?",
                    options: ["ഹഷ്‌ർ", "ഫാത്തിഹ", "മുജാദല"],
                    correctAnswer: 2
                },
                {
                    question: "ഖുര്‍ആനില്‍ പേരെടുത്ത് പറഞ്ഞ ഒരേ ഒരു സ്വഹാബി?",
                    options: ["സൈദ് (റ)", "അബ്ബാസ് (റ)", "അബൂബക്കർ (റ)"],
                    correctAnswer: 0
                },
                {
                    question: "ഖുർആൻ അവതരിച്ച രാത്രിയുടെ പേര്?",
                    options: ["ലൈലത്തുൽ ബറാഅ", "ലൈലത്തുൽ ഷഅബാൻ", "ലൈലത്തുൽ ഖദ്ർ"],
                    correctAnswer: 2
                },
                {
                    question: "ഖുർആനിൽ എത്ര നബിമാരുടെ പേര് പരാമര്‍ശിച്ചിട്ടുണ്ട്?",
                    options: ["33", "15", "25"],
                    correctAnswer: 2
                },
                {
                    question: "ഖുർആനിൽ ഏറ്റവുമധികം തവണ പേര് പറയപ്പെട്ട നബി?",
                    options: ["ഇബ്രാഹീം (അ)", "മൂസ(അ)", "സുലൈമാൻ(അ)"],
                    correctAnswer: 1
                },
                {
                    question: "നരകത്തിന് എത്ര വാതിലുകളുണ്ടെന്നാണ് ഖുര്‍ആനിലെ പരാമര്‍ശം?",
                    options: ["7", "11", "3"],
                    correctAnswer: 0
                },
                {
                    question: "ഖുർആനിന്റെ മണവാട്ടി എന്നറിയപ്പെടുന്ന സൂറത്ത്?",
                    options: ["റഹ്‌മാൻ", "വാഖിഅ", "മുൽക്"],
                    correctAnswer: 0
                },
                {
                    question: "ഖുർആനിന്റെ ഹൃദയം എന്നറിയപ്പെടുന്ന സൂറത്ത്?",
                    options: ["ഇഖ്ലാസ്", "യാസീൻ", "കഹ്‌ഫ്"],
                    correctAnswer: 1
                },
                {
                    question: "ഖുർആൻ പേരെടുത്തു പറഞ്ഞ ഏക സ്ത്രീ?",
                    options: ["മർയം", "ആസിയ", "മാഷിത"],
                    correctAnswer: 0
                },
                {
                    question: "ഖുർആൻ പരാമർശിച്ച റൂഹുൽ ആമീൻ എന്ന മലക്ക് ?",
                    options: ["ജിബ്‌രീൽ", "ഇസ്രാഫീൽ", "അസ്റാഈൽ"],
                    correctAnswer: 0
                },
                {
                    question: "രണ്ട് ബിസ്മിയുള്ള സൂറത്ത്?",
                    options: ["റഹ്‌മാൻ", "ഫാത്തിർ", "നംൽ"],
                    correctAnswer: 2
                },
                {
                    question: "അബാബീൽ പക്ഷികളെ പരാമർശിച്ച സൂറത്ത്?",
                    options: ["ഫീൽ", "ഖുറൈശ്", "മാഊൻ"],
                    correctAnswer: 0
                },
                {
                    question: "ഇബ്രാഹിം (അ) ന്റെ കാലത്ത് ജീവിച്ച മറ്റൊരു നബി?",
                    options: ["ഹാറൂൻ", "ലൂഥ്", "ആർമിയാഅ്"],
                    correctAnswer: 1
                }
            ],
            
            // 2. Hadith
            "2": [
                {
                    question: "ഖുർആൻ കഴിഞ്ഞാൽ ഏറ്റവും ശ്രേഷ്ഠതയുള്ള കിതാബ്?",
                    options: ["സ്വഹീഹ് ബുഖാരി", "സ്വഹീഹ് മുസ്‌ലിം", "തിർമുദി"],
                    correctAnswer: 0
                },
                {
                    question: "അല്ലാഹു മനുഷ്യന്റെ ഏത് ഭാഗത്തേക്കാണ് നോക്കുന്നത്?",
                    options: ["جسد", "جمال", "قلب"],
                    correctAnswer: 2
                },
                {
                    question: "കൊല്ലുന്നവനും കൊല്ലപ്പെടുന്നവനും നരകത്തിലാണ് (കൊല്ലപ്പെടുന്നവൻ എന്ത് കൊണ്ട് നരകത്തിൽ പ്രവേശിക്കുന്നു)",
                    options: ["അവൻ അക്രമിയാണ്", "അവൻ ദൈവ നിഷേധിയാണ്", "അവൻ തന്റെ കൂട്ടുകാരന്റെ വധത്തിൽ ആഗ്രഹമുള്ളവനാണ്"],
                    correctAnswer: 2
                },
                {
                    question: "അല്ലാഹു തൗബ സ്വീകരിക്കാത്ത സമയം?",
                    options: ["അല്ലാഹുവിങ്കൽ കള്ളൻ എന്ന് എഴുതപ്പെട്ടാൽ", "സൂര്യൻ പടിഞ്ഞാറ് നിന്ന് ഉദിച്ചാൽ", "ഈസാനബി (അ) ഇറങ്ങി വന്നാൽ"],
                    correctAnswer: 1
                },
                {
                    question: "(സിദ്ഖ്) മനുഷ്യനെ എവിടേക്ക് നയിക്കും?",
                    options: ["സന്മാർഗം", "സ്വർഗം", "ഗുണം"],
                    correctAnswer: 2
                },
                {
                    question: "ബനൂ ഇസ്റാഈല്യരിലെ ആദ്യ ഫിത്ന ആരിലായിരുന്നു?",
                    options: ["സമ്പന്നൻ", "പെണ്ണ്", "ആണ്"],
                    correctAnswer: 1
                },
                {
                    question: "പക്ഷികൾക്ക് ഭക്ഷണം നൽകുന്നത് പോലെ അല്ലാഹു ഭക്ഷണം നൽകും ആർക്ക്?",
                    options: ["അല്ലാഹുവിനെ ഭരമേല്പിച്ചവർക്ക്", "കുറഞ്ഞത് കൊണ്ട് തൃപ്തിപ്പെടുന്നവർക്ക്", "പ്രഭാതത്തിലും പ്രദോഷത്തിലും മസ്ജിദിൽ പോകുന്നവർക്ക്"],
                    correctAnswer: 0
                },
                {
                    question: "ഉമ്മുസലമ (റ) യുടെ യഥാർത്ഥ പേര്?",
                    options: ["ഹിന്ദ് ബിൻത് അബി ഉത്ബ", "ഹിന്ദ് ബിൻത് അബി ഉമയ്യ", "ഹിന്ദ് ബിൻത് അബി സലമ"],
                    correctAnswer: 1
                },
                {
                    question: "ആര് ആരോട് പറഞ്ഞതാണ് افلا احب ان اكون عبدا شكورا ?",
                    options: ["നബി (സ) ഉമ്മുസലമ (റ)യോട്", "നബി (സ) ആയിഷാ (റ) യോട്", "നബി (സ) അബൂഹുറയ്റ(റ)നോട്"],
                    correctAnswer: 1
                },
                {
                    question: "ഈമാനിന്ന് എത്ര ശാഖകളുണ്ട്?",
                    options: ["70", "60", "50"],
                    correctAnswer: 0
                },
                {
                    question: "അല്ലാഹു അർശിന്റെ തണലിട്ട് കൊടുക്കുന്ന വിഭാഗങ്ങൾ എത്ര?",
                    options: ["10", "7", "5"],
                    correctAnswer: 1
                },
                {
                    question: "ഒരു കാര്യം ചെയ്താൽ നിങ്ങൾ പരസ്പരം സ്നേഹമുള്ളവരാകും. ആ കാര്യം ഏത്?",
                    options: ["സ്വദഖ അധികരിപ്പിക്കുക", "രഹസ്യങ്ങളെ പരസ്യപ്പെടുത്താതിരുന്നാൽ", "സലാം പറയലിനെ വ്യാപിപ്പിക്കുക"],
                    correctAnswer: 2
                },
                {
                    question: "الموجبتان ?",
                    options: ["സ്വർഗവും നരകവും നിർബന്ധമാക്കുന്ന കാര്യം", "നോമ്പും നിസ്കാരവും", "സ്വദഖയും സകാത്തും"],
                    correctAnswer: 0
                },
                {
                    question: "ഈ ഹദീസ് നബി (സ) പറഞ്ഞ സന്ദർഭം ഏത് لايموتن أحدكم إلا وهويحسن الظن بالله عز وجل ?",
                    options: ["വഫാതാകുന്നതിന് മൂന്ന് ദിവസം മുമ്പ്", "വഫാത്തിന്റെ സമയത്ത്", "പനി വന്ന സമയത്ത്"],
                    correctAnswer: 0
                },
                {
                    question: "നബി (സ) പറഞ്ഞു. നിങ്ങളിൽ ഏറ്റവും ഉത്തമർ?",
                    options: ["ഹൃദയം പള്ളികളുമായി ബന്ധപ്പെട്ട വ്യക്തികൾ", "വെള്ള വസ്ത്രം ധരിക്കുന്നവർ", "ഭാര്യമാരോട് നല്ല നിലയിൽ വർത്തിക്കുന്നവർ"],
                    correctAnswer: 2
                },
                {
                    question: "നബി (സ) പറഞ്ഞു. രണ്ടനുഗ്രഹങ്ങൾ ഉപയോഗപ്പെടുത്തുന്നതിൽ അധിക പേരും പരാജിതരാണ്.രണ്ടനുഗ്രഹങ്ങൾ ഏതെല്ലാം?",
                    options: ["المال والبنون", "الصحة والفراغ", "الصلاة والصوم"],
                    correctAnswer: 1
                },
                {
                    question: "വസ്ത്രങ്ങളിൽ ഏറ്റവും ഉത്തമമായ വസ്ത്രം?",
                    options: ["പച്ച നിറത്തിലുള്ള വസ്ത്രം", "വെള്ള നിറത്തിലുള്ളവസ്ത്രം", "പെരുന്നാൾ വസ്ത്രം"],
                    correctAnswer: 1
                },
                {
                    question: "മക്കം ഫത്ഹിന്റെ ദിവസം ആരുടെ തലയിലും താടിയിലുമാണ് നിറം പൂശാൻ കല്പിച്ചത്?",
                    options: ["ابو قحافة", "أبي أمية", "ابو عمر"],
                    correctAnswer: 0
                },
                {
                    question: "മനുഷ്യരെ കൂടുതലായി നരകത്തിലാക്കുന്ന അവയവം?",
                    options: ["عين", "يد", "فرج"],
                    correctAnswer: 2
                },
                {
                    question: "യഥാർത്ഥ ഐശ്വര്യം ഏത്?",
                    options: ["ശാരീരിക ഐശ്വര്യം", "സാമ്പത്തിക ഐശ്വര്യം", "മാനസിക ഐശ്വര്യം"],
                    correctAnswer: 2
                }
            ],
            
            // 3. Fiqh
            "3": [
                {
                    question: "ജുമുഅയുടെ രാവും പകലും _______ ഓതണം?",
                    options: ["യാസീൻ", "കഹ്‌ഫ്", "റഹ്‌മാൻ"],
                    correctAnswer: 1
                },
                {
                    question: "രാത്രി അല്പം ഇറങ്ങിയതിനു ശേഷം എഴുനേറ്റു നമസ്കരിക്കുമ്പോൾ ഖിയാമുലൈലിന്_____________ എന്ന് പറയുന്നു?",
                    options: ["തഹജ്ജുദ്", "ളുഹാ", "തറാവീഹ്"],
                    correctAnswer: 0
                },
                {
                    question: "വിത്ർ എന്ന പതത്തിന്റ്റെ അർഥം ________ ?",
                    options: ["ഇരട്ട", "ഒറ്റ", "പതിവ്"],
                    correctAnswer: 1
                },
                {
                    question: "ഫർള് നമസ്കാരങ്ങളുടെ മുമ്പും ശേഷവും ചെയ്യുന്ന സുന്നത്തുനമസ്കാരങ്ങൾ __________ എന്ന് പറയുന്നു?",
                    options: ["വിത്ർ", "തഹിയ്യത്", "റവാതിബ്"],
                    correctAnswer: 2
                },
                {
                    question: "وارحمه = അർഥം എന്താണ് ?",
                    options: ["ഇദേഹത്തോട് നീ കരുണ കാണിക്കേണമേ", "ങ്ങങ്ങൾക്കൊരു മുന്ഗാമിയെ തെരേണമേ", "ഇദേഹത്തതിന് പ്രവേശന സ്ഥലം നീ വിശാലമാക്കി തരേണമെ"],
                    correctAnswer: 0
                },
                {
                    question: "ജുമുഅ നമസ്കാരം ആർക്കൊക്കെയാണ് നിർബന്ധം?",
                    options: ["പുരുഷന്മാർ", "സ്വതന്ത്ര പുരുഷന്മാർ", "കുട്ടികൾ"],
                    correctAnswer: 1
                },
                {
                    question: "മയ്യിത്ത നമസ്കാരങ്ങൾക് എത്ര ഫർളുകളുണ്ട്?",
                    options: ["8", "6", "4"],
                    correctAnswer: 0
                },
                {
                    question: "നമസ്കാരത്തിൽ ഇളവുള്ളത് ആർക്കൊക്കെ?",
                    options: ["യാത്രക്കാർ", "രോഗികൾ", "യാത്രക്കാർ,രോഗികൾ"],
                    correctAnswer: 0
                },
                {
                    question: "ഹിജ്റ വര്ഷം എത്രാമത്തെ മാസമാണ് റമദാൻ?",
                    options: ["8", "9", "10"],
                    correctAnswer: 0
                },
                {
                    question: "നമസ്കാരം ബാതിലാവുന്ന കാര്യം ചൂസ് ചെയുക?",
                    options: ["നമസ്കാരത്തിന് ശർത്തുകളിലേതെങ്കിലുമൊന്ന് വേണെമെങ്കിൽ പാലിച്ചാൽ", "ഖുർആൻ,ദിക്ർ,ദുആ എന്നിവയെല്ലാത്ത മറ്റു വാക്കുകൾ ഉച്ചരിച്ചാൽ", "നമസ്കാരത്തിനിടയിൽ ആ നമസ്കാരം നിർത്തുകയാണ് എന്ന് കരുതിയില്ലെങ്കിൽ നമസ്കാരം ബാതിലാവും."],
                    correctAnswer: 1
                },
                {
                    question: "വുളൂഇൽ മുഖം കഴുകലിന്റെ വിധി?",
                    options: ["സുന്നത്", "ഫർള്", "ജാഇസ്"],
                    correctAnswer: 1
                },
                {
                    question: "മുന്നിൽ __________ അവർക്കു പിന്നിൽ ________ ഏറ്റവും പിന്നിൽ _________?",
                    options: ["പുരുഷന്മാർ,കുട്ടികൾ,സ്ത്രീകൾ", "പുരുഷന്മാർ,സ്ത്രീകൾ,കുട്ടികൾ", "പുരുഷന്മാർ,പെൺകുട്ടികൾ,സ്ത്രീകൾ"],
                    correctAnswer: 0
                },
                {
                    question: "ജമാഅത് നമസ്കാരങ്ങൾ ശെരിയാവുന്നതിനുള്ള നിബന്ധനകൾ എത്ര?",
                    options: ["5", "7", "12"],
                    correctAnswer: 1
                },
                {
                    question: "നമസ്കാരം ബാതിലാവുന്ന കാര്യങ്ങൾ എത്ര?",
                    options: ["8", "7", "6"],
                    correctAnswer: 2
                },
                {
                    question: "ഇവിടെ കൊടുത്തതിൽ ഏതാണ് സുന്നത്ത്?",
                    options: ["ളുഹർ നമസ്കരിക്കൽ", "നോമ്പ് തുറക്കൽ", "ഖിയാമുലൈൽ ഒറ്റ റകഅത്ത ആയി നിർത്തുക"],
                    correctAnswer: 2
                },
                {
                    question: "ഒരാൾ വജ്ജഹ്തു ഓതാൻ മറന്നു ബിസ്മി ഓതിയാൽ വീണ്ടും വജ്ജഹ്തു ഓതുന്നതിന്റെ വിധി?",
                    options: ["ജാഇസ്", "കറാഹത്", "ഹറാം"],
                    correctAnswer: 2
                },
                {
                    question: "صلاه الاستسقاء ?",
                    options: ["ഗ്രഹണനമസ്കാരം", "നന്മയെ തേടുന്ന നമസ്കാരം", "മഴക്കുവേണ്ടിയുള്ള നമസ്കാരം"],
                    correctAnswer: 2
                },
                {
                    question: "ജുമുഅക്ക് മുമ്പ് റവാതിബ് ഉണ്ടോ?",
                    options: ["ഇല്ല", "ഉണ്ട്", "നിർബന്ധം ഇല്ല"],
                    correctAnswer: 0
                },
                {
                    question: "ഖുതുബയുടെ നിർബന്ധ ഘടകങ്ങൾ എത്ര?",
                    options: ["9", "7", "5"],
                    correctAnswer: 2
                },
                {
                    question: "നമസ്കരിക്കാൻ പാടില്ലാത്ത സമയങ്ങൾ എത്ര?",
                    options: ["5", "4", "3"],
                    correctAnswer: 1
                }
            ],
            
            // 4. Thareeq
            "4": [
                {
                    question: "ഇബ്രാഹിം (അ) ന്റെ സ്വദേശം?",
                    options: ["ഇറാഖ്", "ഇറാൻ", "ഫലസ്തീൻ"],
                    correctAnswer: 0
                },
                {
                    question: "ഉറുമ്പിനോട് സംസാരിച്ച പ്രവാചകൻ?",
                    options: ["ദാവൂദ്", "സുലൈമാൻ", "ഹാറൂൻ"],
                    correctAnswer: 1
                },
                {
                    question: "ഉമ്മുൽ ഖുറാ പട്ടണം ഏത്?",
                    options: ["മക്ക", "മദീന", "ജെറുസലേം"],
                    correctAnswer: 0
                },
                {
                    question: "യഹൂദികൾ ദൈവ പുത്രനായി കണ്ടിരുന്നത് ആരെ?",
                    options: ["ദാനിയാൽ", "ഷംവീൽ", "ഉസൈർ"],
                    correctAnswer: 2
                },
                {
                    question: "അബു ജഹൽ ന്റെ യഥാർത്ഥ പേര്?",
                    options: ["അംറ് ബിൻ അസിം", "അംറ് ബിൻ ഖുതമാ", "അംറ് ബിൻ ഹിഷാം"],
                    correctAnswer: 2
                },
                {
                    question: "നൂഹ് നബിയുടെ പ്രബോധന കാലം?",
                    options: ["670", "950", "786"],
                    correctAnswer: 1
                },
                {
                    question: "നീനവ സമുദായത്തിലേക്ക് അയക്കപ്പെട്ട പ്രവാചകൻ?",
                    options: ["യഹ്‌യ", "യൂനുസ്", "ദുൽകിഫ് ലി"],
                    correctAnswer: 1
                },
                {
                    question: "സമൂദ് സമുദായത്തിലേക്ക് നിയോഗിക്കപ്പെട്ട പ്രവാചകൻ?",
                    options: ["സ്വാലിഹ്", "ഹൂദ്", "ലൂഥ്"],
                    correctAnswer: 0
                },
                {
                    question: "മദ് യനിലെ പ്രവാചകൻ?",
                    options: ["ആർമിയാഅ", "ഷുഹൈബ്", "യൂശഅ"],
                    correctAnswer: 1
                },
                {
                    question: "ഫിർഔനെ മുക്കിയ കടൽ?",
                    options: ["കാസ്പിയൻ", "കരിങ്കടൽ", "ചെങ്കടൽ"],
                    correctAnswer: 2
                },
                {
                    question: "മജൂസികൾ ആര്?",
                    options: ["തീ ആരാധകർ", "കല്ല് ആരാധകർ", "സൂര്യ ആരാധകർ"],
                    correctAnswer: 0
                },
                {
                    question: "ഇസ്ലാമിൽ ഒന്നാമതായി നിർമ്മിക്കപ്പെട്ട പള്ളി?",
                    options: ["മസ്ജിദുൽ അഖ്സ", "മസ്ജിദുൽ ഹറാം", "മസ്ജിദുൽ ഖുബ"],
                    correctAnswer: 2
                },
                {
                    question: "തബൂഖ് യുദ്ധത്തെ കുറിച്ച് പറയുന്ന സൂറത്ത്?",
                    options: ["ഫാത്തിർ", "തൗബ", "ഫുസിലത്"],
                    correctAnswer: 1
                },
                {
                    question: "പടയങ്കിയിൽ പരിഷ്കാരം വരുത്തിയ പ്രവാചകൻ?",
                    options: ["സുലൈമാൻ", "ദാവൂദ്", "ദുൽഖർനൈൻ"],
                    correctAnswer: 1
                },
                {
                    question: "ഇബ്രാഹിം നബി ഇറാഖിൽ നിന്ന് എവിടേക്കാണ് ഹിജ്‌റ പോയത്?",
                    options: ["യസ്രിബ്", "കൂഫ", "ശാം"],
                    correctAnswer: 0
                },
                {
                    question: "അഹ്‌സാബ് യുദ്ധത്തിന്റെ മറ്റൊരു പേര്?",
                    options: ["ബദ്ർ", "ഉഹ്ദ്", "ഖന്തഖ്"],
                    correctAnswer: 2
                },
                {
                    question: "അബുൽ ബശർ എന്ന് അപരനാമം ഉള്ള പ്രവാചകൻ?",
                    options: ["നൂഹ്", "ആദം", "ഇദ് രീസ്"],
                    correctAnswer: 1
                },
                {
                    question: "യഅഖൂബ് നബിയുടെ സന്താനങ്ങൾ?",
                    options: ["14", "12", "16"],
                    correctAnswer: 1
                },
                {
                    question: "മൂസ നബിയുടെ പിതാവിന്റെ പേര്?",
                    options: ["ആസർ", "ഇമ്രാൻ", "മൽക്കാൻ"],
                    correctAnswer: 1
                },
                {
                    question: "അബ്രഹത് ഏത് രാജ്യത്തിന്റെ ഗവർണർ ആയിരുന്നു?",
                    options: ["സിറിയ", "ഇറാഖ്", "യമൻ"],
                    correctAnswer: 2
                }
            ],
            
            // 5. Nahv
            "5": [
                {
                    question: "اختر الصحيح من فعل المضارع",
                    options: ["قال", "بكى", "يرى"],
                    correctAnswer: 2
                },
                {
                    question: "اختر الصحيح من الاسم",
                    options: ["يرموق", "مرض", "بات"],
                    correctAnswer: 0
                },
                {
                    question: "اختر المبتدأ من الجملة 'البستان جميل' ",
                    options: ["البستان", "جميل", "البستان جميل"],
                    correctAnswer: 0
                },
                {
                    question: "اختر الفاعل من الجملة ' ضرب الأستاد زيدا' ",
                    options: ["ضرب", "الأستاد", "زيد"],
                    correctAnswer: 1
                },
                {
                    question: "اختر المفعول من الجملة 'شتم الرجل الطفل' ",
                    options: ["الطفل", "شتم", "الرجل"],
                    correctAnswer: 0
                },
                {
                    question: "اختر اداة الصحيحة من اخت كان",
                    options: ["ليت", "لعل", "أصبح"],
                    correctAnswer: 2
                },
                {
                    question: "اختر اداة الصحيحة من اخت إنّ",
                    options: ["بات", "صار", "لكن"],
                    correctAnswer: 2
                },
                {
                    question: "'ذهب السارق' هل هذه الجملة مفيدة أو غير مفيدة",
                    options: ["نعم", "لا", "غير"],
                    correctAnswer: 1
                },
                {
                    question: "اختر عبارة الصحيحة",
                    options: ["النعت لا يتبع المنعوت", "يرفع اسم إنّ", "ينصب خبر كان"],
                    correctAnswer: 2
                },
                {
                    question: "هل هذه الجملة صحيحة ام لا ' كان زيداً عالمٌ ' ",
                    options: ["نعم", "لا", "غير"],
                    correctAnswer: 1
                },
                {
                    question: "هل هذه الجملة صحيحة ام لا 'زيدٌ عاقلٌ ' ",
                    options: ["نعم", "لا", "غير"],
                    correctAnswer: 0
                },
                {
                    question: "في اي جملة يشتمل فيها حرف الجر",
                    options: ["رجل عاقل", "متى الساعة", "نظرت الى القمر"],
                    correctAnswer: 2
                },
                {
                    question: "هل هذه الجملة صحيحة ام لا 'زيدٌ في البيتَ ' ",
                    options: ["نعم", "لا", "غير"],
                    correctAnswer: 1
                },
                {
                    question: "وفق بحرف الجر الصحيح ' ذهب التاجر السوق' ",
                    options: ["في", "ب", "إلى"],
                    correctAnswer: 2
                },
                {
                    question: "وفق بحرف الجر الصحيح ' ركبتُ السيارة ' ",
                    options: ["في", "من", "على"],
                    correctAnswer: 2
                },
                {
                    question: "وفق بأداة إنّ الصحيح ' السكر مرّ' ",
                    options: ["ليت", "كأنّ", "لعل"],
                    correctAnswer: 0
                },
                {
                    question: "وفق بأداة إنّ الصحيحة 'طلعت الشمس ..... المطر شديد' ",
                    options: ["لعل", "لكن", "كأن"],
                    correctAnswer: 1
                },
                {
                    question: "لم ولا ناهية وإن",
                    options: ["حروف الرفع", "حروف النصب", "حروف الجزم"],
                    correctAnswer: 2
                },
                {
                    question: "أن، لن، إذن، كي",
                    options: ["حروف النصب", "حروف الرفع", "حروف الجزم"],
                    correctAnswer: 0
                },
                {
                    question: "هل هذه الجملة الصحيحة ام لا 'لن يدرسَ ا' ",
                    options: ["لا", "نعم", "غير"],
                    correctAnswer: 1
                }
            ],
            
            // 6. Swarf
            "6": [
                {
                    question: "الأفعال كم اقسام",
                    options: ["5", "3", "4"],
                    correctAnswer: 2
                },
                {
                    question: "الماضي كم اقسام",
                    options: ["4", "12", "2"],
                    correctAnswer: 2
                },
                {
                    question: "المعروف كم اوجه",
                    options: ["20", "14", "12"],
                    correctAnswer: 1
                },
                {
                    question: "صيغة وحدان حكاية نفس متكلم از اثبات فعل ماضي معروف ضمير درو أنا",
                    options: ["أفعل", "ما فعلتُ", "فعلتُ"],
                    correctAnswer: 2
                },
                {
                    question: "صيغة تثنية مذكر عائب از اثبات فعل ماضي مجهول ضمير درو هما",
                    options: ["فُعلتا", "فُعلا", "ما فُعلا"],
                    correctAnswer: 1
                },
                {
                    question: "صيفة وحدان مؤنث عائب از اثبات فعل مستقبل معروف ضمير درو هي",
                    options: ["تفعل", "تفعلين", "لا تفعلان"],
                    correctAnswer: 0
                },
                {
                    question: "اختر الضمير الصحيح  ' ما فعلتُ' ",
                    options: ["نحن", "انت", "انا"],
                    correctAnswer: 2
                },
                {
                    question: "اختر الضمير الصحيح ' ما فُعلتْ ' ",
                    options: ["انتِ", "انا", "هي"],
                    correctAnswer: 2
                },
                {
                    question: "اختر الضمير الصحيح ' تفعلين ' ",
                    options: ["هي", "انتِ", "انتم"],
                    correctAnswer: 1
                },
                {
                    question: "اختر الضمير الصحيح ' لا تفعلنَ ' ",
                    options: ["أنتن", "هن", "هم"],
                    correctAnswer: 0
                },
                {
                    question: "اختر الضمير الصحيح ' لم أفعلْ' ",
                    options: ["أنا", "هو", "أنتَ"],
                    correctAnswer: 0
                },
                {
                    question: "صيغة وحدان حكاية نفس متكلم از نفي فعل مستقبل مجهول ضمير درو أنا",
                    options: ["لم أَفعلْ", "لا أُفعلُ", "ما فُعلتُ"],
                    correctAnswer: 1
                },
                {
                    question: "واذا أردت أن تنفي الفعل المستقبل فزد في اوّله ......",
                    options: ["ما", "لم", "لا"],
                    correctAnswer: 2
                },
                {
                    question: "وإذا أردت ان تجعل المستقبل مجهولا فافتح علامة الاستقبال واضمم عين الفعل",
                    options: ["لا صحيح", "صحيح", "غير"],
                    correctAnswer: 0
                },
                {
                    question: "صيغة جمع مؤنث حاضر از نفي فعل مستقبل معروف ضمير درو أنتن",
                    options: ["تفعلن", "فعلن", "لم تفعلن"],
                    correctAnswer: 2
                },
                {
                    question: "اذا أردت ان تجعل الفعل المستقبل على التأكيد مع النفي فادخل عليه .....",
                    options: ["أن", "لن", "إن"],
                    correctAnswer: 1
                },
                {
                    question: "صيغة وحدان مذكر از أمر حاضر ضمير درو أنتَ",
                    options: ["إفعل", "إفعلي", "إفعلوا"],
                    correctAnswer: 0
                },
                {
                    question: "نون التأكيد كم هي",
                    options: ["3", "2", "1"],
                    correctAnswer: 1
                },
                {
                    question: "صيغة جمع مؤنث از نهي حاضر ضمير درو أنتن",
                    options: ["لا تفعلنْ", "ليفعلنّ", "لم تُفعَلنْ"],
                    correctAnswer: 0
                },
                {
                    question: "صيغة وحدان مذكر از اسم المفعول ضمير درو هو",
                    options: ["فاعل", "مفعول", "مفعولة"],
                    correctAnswer: 1
                }
            ],
            
            // 7. Tasawwuf
            "7": [
                {
                    question: "മസ്നവിയുടെ രചയിതാവ്",
                    options: ["ഇമാം ഗസാലി", "റൂമി", "ഖുശൈരി"],
                    correctAnswer: 1
                },
                {
                    question: "ഇഹ്‌യാ ഉലൂമുദ്ധീ ന്റെ രചയിതാവ്",
                    options: ["റൂമി", "ജുനൈദുൽ ബാഗ്ദാദി", "ഇമാം ഗസാലി"],
                    correctAnswer: 2
                },
                {
                    question: "അൽ ഹികമുൽ അതാഇയ്യ യുടെ രചയിതാവ്",
                    options: ["ഖാജാ ജിഷ്തി അജ്മീരി", "അബ്ദുറഹ്മാൻ അൽ ജാമി", "ഇബ്ൻ അതാഇല്ലാഹി സിക്കന്ദരി"],
                    correctAnswer: 2
                },
                {
                    question: "ബഹ്ജത്തുൽ അസ്റാർ രചിച്ചതാര്",
                    options: ["അബ്ദുറഹ്മാൻ അൽ ജാമി", "മുഹമ്മദ്‌ ഇക്ബാൽ", "ഇബ്ൻ അറബി"],
                    correctAnswer: 0
                },
                {
                    question: "ഫുതൂഹാത്തുൽ മക്കിയ്യ രചിച്ചതാര്",
                    options: ["ഇബ്ൻ അറബി", "മുഹമ്മദ്‌ ഇക്ബാൽ", "ഫരീദദീൻ അത്താർ"],
                    correctAnswer: 0
                },
                {
                    question: "തസ്‌കിറത്തുൽ അവ് ലിയ രചിച്ചതാര്",
                    options: ["ഇമാം ഖുശയ്രി", "ഫരീദദീൻ അത്താർ", "ഇബ്ൻ അറബി"],
                    correctAnswer: 1
                },
                {
                    question: "ഫീഹി മാ ഫീഹി രചിച്ചതാര്",
                    options: ["മുഹമ്മദ്‌ ഇക്ബാൽ", "റൂമി", "ഖുഷയ്രി"],
                    correctAnswer: 1
                },
                {
                    question: "ഖാബ ഖവ്സൈനി രചിച്ചതാര്",
                    options: ["ഇബ്ൻ അറബി", "ജുനൈദുൽ ഭാഗ്ദാദി", "മുഹമ്മദ്‌ ഇക്ബാൽ"],
                    correctAnswer: 2
                },
                {
                    question: "റാബിയ അൽഅദവിയ്യ (ഖ) ജനന വർഷം",
                    options: ["AD 720", "AD 717", "AD 731"],
                    correctAnswer: 1
                },
                {
                    question: "ജുനൈദുൽ ഭാഗ്ദാദി (ഖ) ജനനം",
                    options: ["AD 780", "AD 810", "AD 830"],
                    correctAnswer: 2
                },
                {
                    question: "ഇബ്രാഹിം ബിൻ അധ്ഹം (ഖ) ജനനം",
                    options: ["AD 820", "AD 718", "AD 696"],
                    correctAnswer: 1
                },
                {
                    question: "അബ്ദുൽ ഖാദിർ ജീലാനി (ഖ) ജനനം",
                    options: ["AD 1077", "AD 1091", "AD 1202"],
                    correctAnswer: 0
                },
                {
                    question: "ബാ യാസീദുൽ ബസ്താമി (ഖ) ജനനം",
                    options: ["AD 804", "AD 812", "AD 792"],
                    correctAnswer: 0
                },
                {
                    question: "ജിഷ്തി അജ്മീരി (ഖ) ജനനം",
                    options: ["AD 1124", "AD 1154", "AD 1141"],
                    correctAnswer: 2
                },
                {
                    question: "ജലാലുദ്ധീൻ റൂമി (ഖ) ജനനം",
                    options: ["AD 896", "AD 1207", "AD 1303"],
                    correctAnswer: 1
                },
                {
                    question: "നിസാമുദ്ധീൻ ഔലിയ (ഖ) ജനനം",
                    options: ["AD 1238", "AD 1228", "AD 1218"],
                    correctAnswer: 0
                },
                {
                    question: "അമീർ ഖുസ് റു (ഖ) ജനനം",
                    options: ["AD1229", "AD 1354", "AD 1253"],
                    correctAnswer: 2
                },
                {
                    question: "ശംസുദ്ധീൻ തബ്രീസി (ഖ) യുടെ പ്രദേശം",
                    options: ["ഇറാഖ്", "ഇറാൻ", "ഈജിപ്‌ത്"],
                    correctAnswer: 1
                },
                {
                    question: "അബു ഥാലിബ്‌ അൽ മക്കി (ഖ) യുടെ പ്രദേശം",
                    options: ["ജോർദാൻ", "ഈജിപ്‌ത്", "ഇറാഖ്"],
                    correctAnswer: 2
                },
                {
                    question: "അഹ്മദ് തീജാനി (ഖ) യുടെ പ്രദേശം",
                    options: ["സെർബിയ", "അൽജീരിയ", "മൊറോക്കോ"],
                    correctAnswer: 1
                }
            ],
            
            // 8. Arabic
            "8": [
                {
                    question: "رأس",
                    options: ["head", "hand", "leg"],
                    correctAnswer: 0
                },
                {
                    question: "صباح الخير",
                    options: ["good evening", "good afternoon", "good morning"],
                    correctAnswer: 2
                },
                {
                    question: "سيارة",
                    options: ["plane", "car", "bike"],
                    correctAnswer: 1
                },
                {
                    question: "قهوة",
                    options: ["coffee", "tea", "juice"],
                    correctAnswer: 0
                },
                {
                    question: "منديل",
                    options: ["cap", "shirt", "towel"],
                    correctAnswer: 2
                },
                {
                    question: "طبيب",
                    options: ["patient", "doctor", "nurse"],
                    correctAnswer: 1
                },
                {
                    question: "ليل",
                    options: ["day", "night", "afternoon"],
                    correctAnswer: 1
                },
                {
                    question: "فم",
                    options: ["mouth", "teeth", "nile"],
                    correctAnswer: 0
                },
                {
                    question: "زهرة",
                    options: ["ground", "flower", "plant"],
                    correctAnswer: 1
                },
                {
                    question: "شارع",
                    options: ["street", "city", "bridge"],
                    correctAnswer: 0
                },
                {
                    question: "مدرسة",
                    options: ["restaurant", "college", "school"],
                    correctAnswer: 2
                },
                {
                    question: "سوق",
                    options: ["market", "place", "field"],
                    correctAnswer: 0
                },
                {
                    question: "مكتبة",
                    options: ["office", "program", "student"],
                    correctAnswer: 0
                },
                {
                    question: "قاعة",
                    options: ["playground", "hall", "science"],
                    correctAnswer: 1
                },
                {
                    question: "لحم",
                    options: ["egg", "meat", "milk"],
                    correctAnswer: 1
                },
                {
                    question: "شرطي",
                    options: ["postman", "engineer", "police"],
                    correctAnswer: 2
                },
                {
                    question: "مطبخ",
                    options: ["garden", "kitchen", "market"],
                    correctAnswer: 1
                },
                {
                    question: "بئر",
                    options: ["river", "sea", "well"],
                    correctAnswer: 2
                },
                {
                    question: "قرية",
                    options: ["village", "city", "town"],
                    correctAnswer: 0
                },
                {
                    question: "غابة",
                    options: ["garden", "field", "forest"],
                    correctAnswer: 2
                }
            ],
            
            // 9. Urdu
            "9": [
                {
                    question: "چوتھا",
                    options: ["5th", "4th", "6th"],
                    correctAnswer: 1
                },
                {
                    question: "چھٹا",
                    options: ["4th", "8th", "6th"],
                    correctAnswer: 2
                },
                {
                    question: "ساتواں",
                    options: ["3rd", "9th", "7th"],
                    correctAnswer: 2
                },
                {
                    question: "آدھا",
                    options: ["1/2", "1/4", "3/4"],
                    correctAnswer: 0
                },
                {
                    question: "پونا",
                    options: ["1/2", "1/4", "3/4"],
                    correctAnswer: 2
                },
                {
                    question: "ساڑھے",
                    options: ["1 1/2", "2 1/2", "3 1/2"],
                    correctAnswer: 0
                },
                {
                    question: "تھائی",
                    options: ["3/4", "4/5", "2/3"],
                    correctAnswer: 2
                },
                {
                    question: "چوتھائی",
                    options: ["1/4", "1/3", "2/3"],
                    correctAnswer: 0
                },
                {
                    question: "سوا",
                    options: ["1 1/3", "2 1/2", "1 1/4"],
                    correctAnswer: 2
                },
                {
                    question: "پچاس",
                    options: ["45", "50", "55"],
                    correctAnswer: 1
                },
                {
                    question: "چونسٹھ",
                    options: ["84", "74", "64"],
                    correctAnswer: 2
                },
                {
                    question: "تہتر",
                    options: ["43", "73", "52"],
                    correctAnswer: 1
                },
                {
                    question: "چھیاسی",
                    options: ["46", "86", "36"],
                    correctAnswer: 1
                },
                {
                    question: "نواسی",
                    options: ["99", "89", "49"],
                    correctAnswer: 1
                },
                {
                    question: "اٹھانوے",
                    options: ["98", "79", "59"],
                    correctAnswer: 0
                },
                {
                    question: "تریپن",
                    options: ["33", "53", "73"],
                    correctAnswer: 1
                },
                {
                    question: "چھیالیس",
                    options: ["46", "64", "74"],
                    correctAnswer: 0
                },
                {
                    question: "چھتیس",
                    options: ["36", "83", "28"],
                    correctAnswer: 0
                },
                {
                    question: "گیارہ",
                    options: ["11", "12", "13"],
                    correctAnswer: 0
                },
                {
                    question: "انیس",
                    options: ["29", "69", "19"],
                    correctAnswer: 2
                }
            ],
            
            // 10. Malayalam
            "10": [
                {
                    question: "ആധുനിക മലയാള സാഹിത്യത്തിന്റെ പിതാവ് എന്നറിയപ്പെടുന്നത് ആരാണ്?",
                    options: ["തകഴി", "ബഷീർ", "എം ട്ടി വാസുദേവൻ"],
                    correctAnswer: 0
                },
                {
                    question: "1965-ൽ ജ്ഞാനപീഠ പുരസ്കാരം നേടിയ മലയാളത്തിലെ പ്രശസ്ത കവി?",
                    options: ["കെ സച്ചിദാനന്ദൻ", "ജി ശങ്കര കുറുപ്പ്", "ഒ എൻ വി കുറുപ്പ്"],
                    correctAnswer: 1
                },
                {
                    question: "പ്രശസ്ത മലയാള നോവലായ 'ചെമ്മീൻ' എഴുതിയത് ആരാണ്?",
                    options: ["കമല സുരയ്യ", "തകഴി", "ഒ എൻ വി കുറുപ്പ്"],
                    correctAnswer: 1
                },
                {
                    question: "ബാല്യകാലസഖി' എന്ന കൃതിയിലൂടെ പ്രശസ്തനായ മലയാള എഴുത്തുകാരൻ?",
                    options: ["ബഷീർ", "എം ട്ടി വാസുദേവൻ", "ജി ശങ്കര കുറുപ്പ്"],
                    correctAnswer: 0
                },
                {
                    question: "പ്രശസ്ത മലയാള നോവലായ 'നാലുകെട്ട്' എഴുതിയത് ആരാണ്?",
                    options: ["വൈലോപ്പിള്ളി", "എം ട്ടി വാസുദേവൻ", "അരുന്ധതി റോയ്"],
                    correctAnswer: 1
                },
                {
                    question: "രണ്ടിടങ്ങഴി' എന്ന കൃതിയിലൂടെ പ്രശസ്തനായ മലയാള എഴുത്തുകാരൻ?",
                    options: ["തകഴി", "ആർ കെ നാരായണൻ", "കമല സുരയ്യ"],
                    correctAnswer: 0
                },
                {
                    question: "ഖസക്കിൻ്റെ ഇതിഹാസം' എന്ന പ്രശസ്ത മലയാള നോവലിൻ്റെ രചയിതാവ് ആരാണ്?",
                    options: ["അരുന്ധതി റോയ്", "ഒ വി വിജയൻ", "ആർ കെ നാരായണൻ"],
                    correctAnswer: 1
                },
                {
                    question: "ഒരു ദേശത്തിന്റെ കഥ' എന്ന കൃതിയിലൂടെ പ്രശസ്തനായ മലയാള എഴുത്തുകാരൻ?",
                    options: ["ഒ എൻ വി കുറുപ്പ്", "തകഴി", "എസ് കെ പൊറ്റക്കാട്"],
                    correctAnswer: 2
                },
                {
                    question: "നാലുകെട്ട് എന്ന പ്രശസ്ത മലയാള നോവലിൻ്റെ രചയിതാവ് ആരാണ്??",
                    options: ["എസ് കെ പൊറ്റക്കാട്", "ജുംപ ലാഹിരി", "എം ട്ടി വാസുദേവൻ"],
                    correctAnswer: 2
                },
                {
                    question: "കുന്ദലത' എന്ന കൃതിയിലൂടെ പ്രശസ്തനായ മലയാള എഴുത്തുകാരൻ?",
                    options: ["അപ്പു നെടുങ്ങാടി", "വെയ്ലോപ്പിള്ളി", "ഒ എൻ വി കുറുപ്പ്"],
                    correctAnswer: 0
                },
                {
                    question: "മലയാളത്തിലെ ആദ്യത്തെ നോവൽ ഏതാണ്?",
                    options: ["കുറ്റി", "അടുത്തത്", "കുണ്ഠിലിനി"],
                    correctAnswer: 0
                },
                {
                    question: "ആരോഹണം എഴുതിയത് ആരാണ്?",
                    options: ["കുമാരനാശാൻ", "വി കെ എൻ", "ഒ വി വിജയൻ"],
                    correctAnswer: 1
                },
                {
                    question: "ആരാണ് കുട്ടനാടിന്റെ ഇതിഹാസ കാരൻ",
                    options: ["തുഞ്ചത്തെഴുത്തച്ഛൻ", "തകഴി", "ബഷീർ"],
                    correctAnswer: 1
                },
                {
                    question: "മലയാളത്തിൽ 'ലക്ഷണമോഹ' നോവൽ എന്നറിയപ്പെടുന്നത് ഏത്?",
                    options: ["കുന്ദലത", "അടുത്തത്", "ഷാരധ"],
                    correctAnswer: 1
                },
                {
                    question: "പാത്തുമ്മയുടെ ആടു' എഴുതിയത് ആരാണ്?",
                    options: ["ബഷീർ", "ഉറൂബ്", "ഫിറോസ്"],
                    correctAnswer: 0
                },
                {
                    question: "സ്നാനം എന്നതിന്റെ അർത്ഥം",
                    options: ["പോവുക", "കുളിക്കുക", "തബസ്സിരിക്കുക"],
                    correctAnswer: 1
                },
                {
                    question: "അഭിഷേകം എന്നതിന്റെ അർത്ഥം",
                    options: ["ഊഹം", "സ്വപ്നം", "ഒഴിക്കുക"],
                    correctAnswer: 2
                },
                {
                    question: "ലത എന്നാൽ എന്ത്",
                    options: ["വേര്", "തണ്ട്", "വള്ളി"],
                    correctAnswer: 2
                },
                {
                    question: "ഒരമ്മ പെറ്റ പന്തിര കുലത്തിലെ കഥാപാത്രം",
                    options: ["ബിജു", "നാറാണത് ഭ്രാന്തൻ", "സ്വാമി"],
                    correctAnswer: 1
                },
                {
                    question: " 'ഞാൻ അവനെ അടിച്ചു' എന്നതിൽ ക്രിയ ഏതാണ്?",
                    options: ["ഞാൻ", "അവനെ", "അടിച്ചു"],
                    correctAnswer: 2
                }
            ],
            
            // 11. English
            "11": [
                {
                    question: "he was a good fighter. what is he?",
                    options: ["noun", "pronoun", "adjective"],
                    correctAnswer: 1
                },
                {
                    question: "soldier killed enemy. select the verb from this",
                    options: ["killed", "soldier", "enemy"],
                    correctAnswer: 0
                },
                {
                    question: "rashid went to school. which noun used here as subject",
                    options: ["to", "school", "rashid"],
                    correctAnswer: 2
                },
                {
                    question: "Bakreed is my favourite day of the year. Which word is the proper noun?",
                    options: ["Bakreed", "year", "my"],
                    correctAnswer: 0
                },
                {
                    question: "The dog ran across the farmyard. select the preposition",
                    options: ["across", "the", "farmyard"],
                    correctAnswer: 0
                },
                {
                    question: "We bought a black cat from the Pets At Home. Which word is the adjective?",
                    options: ["pet", "black", "bought"],
                    correctAnswer: 1
                },
                {
                    question: "Sufyan is singing his favourite song. Which word is the verb?",
                    options: ["is", "favorite", "singing"],
                    correctAnswer: 2
                },
                {
                    question: "I heared a beautiful Qur'an recitation. which word is adjective?",
                    options: ["beautiful", "recitation", "Qur'an"],
                    correctAnswer: 0
                },
                {
                    question: "We went to Hyderabad on wednesday. What type of word is Wednesday?",
                    options: ["noun", "pronoun", "adjective"],
                    correctAnswer: 0
                },
                {
                    question: "The happy frog leaped from leaf to leaf in the pond. What type of word is happy?",
                    options: ["adverb", "preposition", "adjective"],
                    correctAnswer: 2
                },
                {
                    question: "The train reached in Kuttippuram fastly. what type of word is fastly?",
                    options: ["adjective", "conjunction", "adverb"],
                    correctAnswer: 2
                },
                {
                    question: "That car is driving very quickly. which word is adverb in this?",
                    options: ["quickly", "driving", "is"],
                    correctAnswer: 0
                },
                {
                    question: "Birds migrate when it gets cold. Which word is the noun?",
                    options: ["cold", "birds", "when"],
                    correctAnswer: 1
                },
                {
                    question: "He was my old friend. Which word is the pronoun?",
                    options: ["my", "old", "he"],
                    correctAnswer: 2
                },
                {
                    question: "Adam swam amazingly to win a gold medal in the Olympics. What type of word is amazingly?",
                    options: ["interjection", "conjunction", "adverb"],
                    correctAnswer: 2
                },
                {
                    question: "The teacher always tried to solve that problem. What type of word is always?",
                    options: ["verb", "adverb", "adjective"],
                    correctAnswer: 1
                },
                {
                    question: "The boy was happy because he was going fishing with his dad. Which word is the pronoun?",
                    options: ["he", "was", "with"],
                    correctAnswer: 0
                },
                {
                    question: "Suhail gave a gift to teacher. which word is the preposition?",
                    options: ["a", "to", "gave"],
                    correctAnswer: 1
                },
                {
                    question: "rasheed requested to move side. what type of word is requested?",
                    options: ["adverb", "verb", "adjective"],
                    correctAnswer: 1
                },
                {
                    question: "I will go to Delhi. Which word is the proper noun?",
                    options: ["I", "go", "Delhi"],
                    correctAnswer: 2
                }
            ],
            
            // 12. Hindi
            "12": [
                {
                    question: "Select the correct (नमस्ते)",
                    options: ["hello", "welcome", "thanks"],
                    correctAnswer: 0
                },
                {
                    question: "Select the correct (स्वागत)",
                    options: ["good bye", "see you", "welcome"],
                    correctAnswer: 2
                },
                {
                    question: "Select the correct (धन्यवाद)",
                    options: ["please", "thank you", "sorry"],
                    correctAnswer: 0
                },
                {
                    question: "Select the correct (माफ़ करना)",
                    options: ["little", "good afternoon", "sorry"],
                    correctAnswer: 2
                },
                {
                    question: "Select the correct (सुसंध्या)",
                    options: ["good morning", "good evening", "good night"],
                    correctAnswer: 1
                },
                {
                    question: "Select the correct (फिर मिलेंगे)",
                    options: ["see you", "good bye", "tomorrow"],
                    correctAnswer: 0
                },
                {
                    question: "Select the correct (सुंदर)",
                    options: ["fast", "beautiful", "revenge"],
                    correctAnswer: 1
                },
                {
                    question: "Select the correct (आशा)",
                    options: ["need", "hope", "today"],
                    correctAnswer: 1
                },
                {
                    question: "Select the correct (रैना)",
                    options: ["day", "night", "evening"],
                    correctAnswer: 1
                },
                {
                    question: "Select the correct (चलो)",
                    options: ["let's go", "stop there", "running"],
                    correctAnswer: 0
                },
                {
                    question: "Select the correct (रुको)",
                    options: ["bye", "stop", "super"],
                    correctAnswer: 1
                },
                {
                    question: "Select the correct (अच्छा)",
                    options: ["good", "bad", "nothing"],
                    correctAnswer: 0
                },
                {
                    question: "Select the correct (खाना)",
                    options: ["water", "juice", "food"],
                    correctAnswer: 2
                },
                {
                    question: "Select the correct (आज)",
                    options: ["today", "yesterday", "tomorrow"],
                    correctAnswer: 0
                },
                {
                    question: "Select the correct (खेलो)",
                    options: ["eat", "drink", "play"],
                    correctAnswer: 2
                },
                {
                    question: "Select the correct (पानी)",
                    options: ["grape", "water", "orange"],
                    correctAnswer: 1
                },
                {
                    question: "Select the correct (भाई)",
                    options: ["mom", "brother", "bap"],
                    correctAnswer: 1
                },
                {
                    question: "Select the correct (बहन)",
                    options: ["daughter", "mom", "sister"],
                    correctAnswer: 2
                },
                {
                    question: "Select the correct (परिवार)",
                    options: ["school", "family", "market"],
                    correctAnswer: 1
                },
                {
                    question: "Select the correct (मोहब्बत)",
                    options: ["hate", "ego", "love"],
                    correctAnswer: 2
                }
            ],
            
            // 13. Mathematics
            "13": [
                {
                    question: "6+5?",
                    options: ["20", "13", "11"],
                    correctAnswer: 2
                },
                {
                    question: "7+18?",
                    options: ["25", "31", "22"],
                    correctAnswer: 0
                },
                {
                    question: "6×7?",
                    options: ["54", "38", "42"],
                    correctAnswer: 2
                },
                {
                    question: "25+39?",
                    options: ["74", "64", "58"],
                    correctAnswer: 1
                },
                {
                    question: "12÷3?",
                    options: ["4", "3", "6"],
                    correctAnswer: 0
                },
                {
                    question: "56÷7?",
                    options: ["6", "7", "8"],
                    correctAnswer: 2
                },
                {
                    question: "80÷8?",
                    options: ["11", "10", "9"],
                    correctAnswer: 1
                },
                {
                    question: "72-9?",
                    options: ["63", "58", "61"],
                    correctAnswer: 0
                },
                {
                    question: "44-7?",
                    options: ["35", "37", "39"],
                    correctAnswer: 1
                },
                {
                    question: "60-13?",
                    options: ["37", "57", "47"],
                    correctAnswer: 2
                },
                {
                    question: "2,4,6,8,_?",
                    options: ["10", "12", "9"],
                    correctAnswer: 0
                },
                {
                    question: "7,10,13,16,_?",
                    options: ["18", "19", "20"],
                    correctAnswer: 1
                },
                {
                    question: "2,0,-2,-4,_?",
                    options: ["-3", "-5", "-6"],
                    correctAnswer: 2
                },
                {
                    question: "-4,8,16,_?",
                    options: ["24", "20", "26"],
                    correctAnswer: 0
                },
                {
                    question: "3/7+4/7?",
                    options: ["6/7", "7/7", "8/7"],
                    correctAnswer: 1
                },
                {
                    question: "5/8+2/8?",
                    options: ["6/8", "7/8", "8/8"],
                    correctAnswer: 1
                },
                {
                    question: "1/4,1/2  which is the great?",
                    options: ["1/4", "both are equal", "1/2"],
                    correctAnswer: 2
                },
                {
                    question: "3/4,6/12 which is the great?",
                    options: ["both are equal", "3/4", "6/12"],
                    correctAnswer: 1
                },
                {
                    question: "3 1/4 =?",
                    options: ["12/4", "13/4", "11/4"],
                    correctAnswer: 1
                },
                {
                    question: "100×100?",
                    options: ["10,000", "1,00,000", "10,00,000"],
                    correctAnswer: 0
                }
            ],
            
            // 14. Social science
            "14": [
                {
                    question: "What is history?",
                    options: ["Study of stars", "Study of past events", "Study of animals"],
                    correctAnswer: 1
                },
                {
                    question: "Who are archaeologists?",
                    options: ["People who write books", "People who study old coins and buildings", "People who make laws"],
                    correctAnswer: 1
                },
                {
                    question: "What are manuscripts?",
                    options: ["Printed books", "Newspaper articles", "Handwritten records"],
                    correctAnswer: 2
                },
                {
                    question: "The word 'India' comes from which river's name?",
                    options: ["Ganga", "Narmada", "Indus"],
                    correctAnswer: 2
                },
                {
                    question: "The earliest people lived near which type of place?",
                    options: ["rivers", "mountains", "deserts"],
                    correctAnswer: 0
                },
                {
                    question: "What does BC stand for in history?",
                    options: ["Before Coffee", "Before Christ", "Before Calendar"],
                    correctAnswer: 1
                },
                {
                    question: "What did early humans use for tools?",
                    options: ["iron", "plastic", "stone"],
                    correctAnswer: 2
                },
                {
                    question: "In which age did people start farming?",
                    options: ["ice age", "stone age", "modern age"],
                    correctAnswer: 1
                },
                {
                    question: "Which material was used to make tools in the Neolithic age?",
                    options: ["Bronze", "Plastic", "Polished stone"],
                    correctAnswer: 2
                },
                {
                    question: "The Harappan cities were known for their:",
                    options: ["Big markets", "Planned layout and drainage system", "Temples"],
                    correctAnswer: 1
                },
                {
                    question: "Which animal was important in Harappan culture?",
                    options: ["tiger", "elephant", "bull"],
                    correctAnswer: 2
                },
                {
                    question: "Who discovered Harappa?",
                    options: ["R.D. Banerji", "Ashoka", "Mourya"],
                    correctAnswer: 0
                },
                {
                    question: "Vedas are written in which language?",
                    options: ["Tamil", "Hindi", "Sanskrit"],
                    correctAnswer: 2
                },
                {
                    question: "Which Veda is the oldest?",
                    options: ["Sama Veda", "Rigveda", "Yajur Veda"],
                    correctAnswer: 1
                },
                {
                    question: "Who composed the Rigveda?",
                    options: ["Farmers", "priests", "kings"],
                    correctAnswer: 1
                },
                {
                    question: "The Janapadas were:",
                    options: ["Forests", "Villages", "Small kingdoms"],
                    correctAnswer: 2
                },
                {
                    question: "Magadha was located in which part of India?",
                    options: ["North-East", "South", "West"],
                    correctAnswer: 0
                },
                {
                    question: "Ashoka belonged to which dynasty?",
                    options: ["Maurya", "Gupta", "Mughal"],
                    correctAnswer: 0
                },
                {
                    question: "Who was the founder of Buddhism?",
                    options: ["Mahavira", "Ashoka", "Gautama Buddha"],
                    correctAnswer: 2
                },
                {
                    question: "What does AD stand for?",
                    options: ["After Date", "Anno Domini", "Ancient Day"],
                    correctAnswer: 1
                }
            ],
            
            // 15. IT
            "15": [
                {
                    question: "What does IT stand for?",
                    options: ["Internet Team", "Information Technology", "Internal Tool"],
                    correctAnswer: 1
                },
                {
                    question: "Which device is used to input data into a computer?",
                    options: ["Monitor", "Keyboard", "Printer"],
                    correctAnswer: 1
                },
                {
                    question: "What is the brain of the computer?",
                    options: ["Monitor", "UPS", "CPU"],
                    correctAnswer: 2
                },
                {
                    question: "Which one is an output device?",
                    options: ["Mouse", "Scanner", "Printer"],
                    correctAnswer: 2
                },
                {
                    question: "Which of the following stores data permanently?",
                    options: ["RAM", "Hard Disk", "ROM"],
                    correctAnswer: 1
                },
                {
                    question: "What does CPU stand for?",
                    options: ["Central Processing Unit", "Computer Power Unit", "Control Program Unit"],
                    correctAnswer: 0
                },
                {
                    question: "Which software helps to browse the internet?",
                    options: ["MS Word", "Chrome", "Paint"],
                    correctAnswer: 1
                },
                {
                    question: "What is the full form of URL?",
                    options: ["Uniform Resource Locator", "Universal Record Link", "Unique Reference Link"],
                    correctAnswer: 0
                },
                {
                    question: "What is the full form of Wi-Fi?",
                    options: ["Wireless Finder", "Wide Fidelity", "Wireless Fidelity"],
                    correctAnswer: 2
                },
                {
                    question: "Which device is used to click and select on screen?",
                    options: ["Keyboard", "CPU", "Mouse"],
                    correctAnswer: 2
                },
                {
                    question: "What is software?",
                    options: ["A physical part", "A program that runs on a computer", "A storage device"],
                    correctAnswer: 1
                },
                {
                    question: "What is an example of an operating system?",
                    options: ["Windows", "Google", "Excel"],
                    correctAnswer: 0
                },
                {
                    question: "What does HTTP stand for?",
                    options: ["Hyper Type Text Protocol", "Hypertext Transfer Protocol", "Home Transfer Text Program"],
                    correctAnswer: 1
                },
                {
                    question: "Which part displays the output?",
                    options: ["Monitor", "Speaker", "Headset"],
                    correctAnswer: 0
                },
                {
                    question: "What is the main page of a website called?",
                    options: ["Link page", "First page", "Home page"],
                    correctAnswer: 2
                },
                {
                    question: "What is the use of MS Word?",
                    options: ["Watching movies", "Making documents", "Listening to music"],
                    correctAnswer: 1
                },
                {
                    question: "What is the full form of PDF?",
                    options: ["Portable Document Format", "Print Document File", "Page Data Format"],
                    correctAnswer: 0
                },
                {
                    question: "Which of these is a search engine?",
                    options: ["Gmail", "Google", "YouTube"],
                    correctAnswer: 1
                },
                {
                    question: "What does RAM stand for?",
                    options: ["Read Access Memory", "Random Access Memory", "Random Application Module"],
                    correctAnswer: 1
                },
                {
                    question: "Who is known as the 'Father of the Computer'?",
                    options: ["Charles Babbage", "Alan Turing", "Bill Gates"],
                    correctAnswer: 0
                }
            ],
            
            // 16. Science
            "16": [
                {
                    question: "What do plants need to make food?",
                    options: ["Sunlight", "Moonlight", "Wind"],
                    correctAnswer: 0
                },
                {
                    question: "Which gas do we breathe in to stay alive?",
                    options: ["Oxygen", "Carbon dioxide", "Nitrogen"],
                    correctAnswer: 0
                },
                {
                    question: "What is the name of our galaxy?",
                    options: ["Milky Way", "Andromeda", "Triangulum"],
                    correctAnswer: 0
                },
                {
                    question: "Water boils at:",
                    options: ["0°C", "50°C", "100°C"],
                    correctAnswer: 2
                },
                {
                    question: "Which part of the plant absorbs water?",
                    options: ["Leaf", "Root", "Flower"],
                    correctAnswer: 1
                },
                {
                    question: "The Earth revolves around the:",
                    options: ["Moon", "Sun", "Mars"],
                    correctAnswer: 1
                },
                {
                    question: "The hardest natural substance is:",
                    options: ["Gold", "Iron", "Diamond"],
                    correctAnswer: 2
                },
                {
                    question: "Which phenomenon occurs when the Moon passes between the Sun and Earth?",
                    options: ["Transit", "Lunar eclipse", "Solar eclipse"],
                    correctAnswer: 2
                },
                {
                    question: "Which organ pumps blood in our body?",
                    options: ["Lungs", "Heart", "Brain"],
                    correctAnswer: 1
                },
                {
                    question: "Which planet is known as the 'Red Planet'?",
                    options: ["Mars", "Venus", "Jupiter"],
                    correctAnswer: 0
                },
                {
                    question: "What do we use to see tiny things?",
                    options: ["Telescope", "Microscope", "Camera"],
                    correctAnswer: 1
                },
                {
                    question: "Which of the following is a solid?",
                    options: ["Milk", "Stone", "Water"],
                    correctAnswer: 1
                },
                {
                    question: "What is the study of the universe beyond Earth's atmosphere called?",
                    options: ["Science", "Astrology", "Cosmology"],
                    correctAnswer: 0
                },
                {
                    question: "Which of these is a sense organ?",
                    options: ["Hair", "Bone", "Nose"],
                    correctAnswer: 2
                },
                {
                    question: "How many bones are there in an adult human body?",
                    options: ["300", "206", "258"],
                    correctAnswer: 1
                },
                {
                    question: "Which vitamin do we get from sunlight?",
                    options: ["Vitamin C", "Vitamin D", "Vitamin A"],
                    correctAnswer: 1
                },
                {
                    question: "What is H2O?",
                    options: ["Salt", "Oxygen", "Water"],
                    correctAnswer: 2
                },
                {
                    question: "Which is a liquid?",
                    options: ["Ice", "Steam", "Milk"],
                    correctAnswer: 2
                },
                {
                    question: "What is a black hole?",
                    options: ["A region of space with gravity so strong that nothing can escape", "A type of star", "An empty region in space"],
                    correctAnswer: 0
                },
                {
                    question: "What helps plants to grow?",
                    options: ["Rocks, plastic, wind", "Cement, water, sun", "Soil, water, sunlight"],
                    correctAnswer: 2
                }
            ]
        };

        const subjects = [
            { id: "1", name: "Qur'an ", icon: "fa-book-open" },
            { id: "2", name: "Hadith", icon: "fa-book-open" },
            { id: "3", name: "Fiqh", icon: "fa-book-open" },
            { id: "4", name: "Thareeq", icon: "fa-globe-americas" },
            { id: "5", name: "Nahv", icon: "fa-book-open" },
            { id: "6", name: "Swarf", icon: "fa-book-open" },
            { id: "7", name: "Tasawwuf", icon: "fa-book-open" },
            { id: "8", name: "Arabic", icon: "fa-language" },
            { id: "9", name: "Urdu", icon: "fa-language" },
            { id: "10", name: "Malayalam", icon: "fa-language" },
            { id: "11", name: "English", icon: "fa-language" },
            { id: "12", name: "Hindi", icon: "fa-language" },
            { id: "13", name: "Mathematics", icon: "fa-calculator" },
            { id: "14", name: "Social science", icon: "fa-users" },
            { id: "15", name: "IT", icon: "fa-laptop-code" },
            { id: "16", name: "Science", icon: "fa-flask" }
        ];

        // Data management
        let userData = {
            username: '',
            adno: '',
            scores: {},
            totalScore: 0
        };

        // Current quiz state
        let currentQuiz = {
            subjectId: '',
            questions: [],
            currentQuestionIndex: 0,
            score: 0,
            answers: [],
            timer: null
        };

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            loadUserData();
            setupEventListeners();
            setupSecurityListeners();
            
            if (userData.username) {
                showDashboard();
            }
        });

        // Event listeners setup
        function setupEventListeners() {
            // Login form
            document.getElementById('login-form').addEventListener('submit', function(e) {
                e.preventDefault();
                login();
            });
            
            // Dashboard buttons
            document.getElementById('start-quiz-btn').addEventListener('click', function() {
                showPage('subjects-page');
            });
            
            document.getElementById('logout-btn').addEventListener('click', logout);
            
            // Subject page buttons
            document.getElementById('back-to-dashboard').addEventListener('click', function() {
                showPage('dashboard-page');
            });
            
            // Results page buttons
            document.getElementById('download-result-btn').addEventListener('click', downloadResult);
            document.getElementById('try-another-btn').addEventListener('click', function() {
                showPage('subjects-page');
            });
            document.getElementById('results-to-dashboard-btn').addEventListener('click', function() {
                showPage('dashboard-page');
            });
        }

        // Login functionality
        function login() {
            const username = document.getElementById('username').value.trim();
            const adno = document.getElementById('adno').value.trim();
            
            if (username && adno) {
                userData.username = username;
                userData.adno = adno;
                userData.scores = userData.scores || {};
                userData.totalScore = calculateTotalScore();
                
                saveUserData();
                showDashboard();
            }
        }

        // Logout functionality
        function logout() {
            localStorage.removeItem('quizMasterUserData');
            userData = {
                username: '',
                adno: '',
                scores: {},
                totalScore: 0
            };
            isQuizActive = false;
            isFullscreenLocked = false;
            showPage('login-page');
        }

        // Show dashboard
        function showDashboard() {
            document.getElementById('user-name').textContent = userData.username;
            document.getElementById('user-adno').textContent = userData.adno;
            
            // Calculate and display total score
            const totalScore = calculateTotalScore();
            document.getElementById('total-points').textContent = totalScore;
            
            // Calculate completed subjects
            const completedSubjects = Object.keys(userData.scores).length;
            document.getElementById('completed-subjects').textContent = completedSubjects;
            
            // Create dashboard chart
            createDashboardChart(totalScore);
            
            // Display recent activity
            updateRecentActivity();
            
            // Generate subject cards
            generateSubjectCards();
            
            showPage('dashboard-page');
        }

        // Generate subject cards
        function generateSubjectCards() {
            const container = document.getElementById('subjects-container');
            container.innerHTML = '';
            
            subjects.forEach(subject => {
                const score = userData.scores[subject.id] || 0;
                const isCompleted = score > 0;
                
                const card = document.createElement('div');
                card.className = 'subject-card transition-all duration-300';
                card.innerHTML = `
                    <div class="flex items-center mb-2">
                        <i class="fas ${subject.icon} text-2xl mr-3"></i>
                        <h3 class="font-bold text-lg">${subject.name}</h3>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-sm">${isCompleted ? `Score: ${score}/20` : 'Not attempted'}</span>
                        <span class="px-2 py-1 text-xs rounded ${isCompleted ? 'bg-green-400 text-green-900' : 'bg-blue-400 text-blue-900'}">
                            ${isCompleted ? 'Completed' : 'Start'}
                        </span>
                    </div>
                `;
                
                card.addEventListener('click', function() {
                    startQuiz(subject.id);
                });
                
                container.appendChild(card);
            });
        }

        // Start a quiz for a specific subject
        function startQuiz(subjectId) {
            if (securityViolated) return;
            
            const subject = subjects.find(s => s.id === subjectId);
            if (!subject) return;
            
            currentQuiz = {
                subjectId: subjectId,
                questions: [...subjectQuestions[subjectId]],
                currentQuestionIndex: 0,
                score: 0,
                answers: [],
                timer: null
            };
            
            document.getElementById('quiz-subject-title').textContent = `${subject.name} `;
            
            // Activate security measures
            isQuizActive = true;
            enterFullscreen();
            
            // Wait a moment for fullscreen to activate, then load question
            setTimeout(() => {
                loadQuestion();
                showPage('quiz-page');
            }, 500);
        }

        // Load the current question
        function loadQuestion() {
            if (securityViolated) return;
            
            if (currentQuiz.currentQuestionIndex >= currentQuiz.questions.length) {
                endQuiz();
                return;
            }
            
            const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
            document.getElementById('current-question').textContent = currentQuiz.currentQuestionIndex + 1;
            document.getElementById('question-text').textContent = question.question;
            
            // Reset timer
            if (currentQuiz.timer) {
                clearInterval(currentQuiz.timer);
            }
            
            // Set up options
            const optionsContainer = document.getElementById('options-container');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const optionBtn = document.createElement('button');
                optionBtn.className = 'option-btn';
                optionBtn.textContent = option;
                optionBtn.dataset.index = index;
                
                optionBtn.addEventListener('click', function() {
                    selectOption(index);
                });
                
                optionsContainer.appendChild(optionBtn);
            });
            
            // Start timer
            startTimer();
            
            // Update current score
            document.getElementById('current-score').textContent = currentQuiz.score;
            
            // Restart animation for timer bar
            const timerBar = document.getElementById('timer-bar');
            timerBar.style.animation = 'none';
            setTimeout(() => {
                timerBar.style.animation = 'timerAnimation 15s linear forwards';
            }, 10);
        }

        // Start timer for current question
        function startTimer() {
            let timeLeft = 15;
            document.getElementById('timer').textContent = timeLeft;
            
            currentQuiz.timer = setInterval(() => {
                if (securityViolated) {
                    clearInterval(currentQuiz.timer);
                    return;
                }
                
                timeLeft--;
                document.getElementById('timer').textContent = timeLeft;
                
                if (timeLeft <= 5) {
                    document.getElementById('timer').classList.add('text-red-500');
                } else {
                    document.getElementById('timer').classList.remove('text-red-500');
                }
                
                if (timeLeft <= 0) {
                    clearInterval(currentQuiz.timer);
                    timeOut();
                }
            }, 1000);
        }

        // Handle timeout for a question
        function timeOut() {
            if (securityViolated) return;
            
            const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
            
            // Record answer as timeout
            currentQuiz.answers.push({
                question: question.question,
                selectedOption: -1,
                correctOption: question.correctAnswer,
                isCorrect: false
            });
            
            // Show correct answer
            const options = document.querySelectorAll('.option-btn');
            options.forEach((option, index) => {
                if (index === question.correctAnswer) {
                    option.classList.add('option-correct');
                }
                option.disabled = true;
            });
            
            // Wait a moment to show the correct answer
            setTimeout(() => {
                if (!securityViolated) {
                    currentQuiz.currentQuestionIndex++;
                    loadQuestion();
                }
            }, 1500);
        }

        // Select an option for the current question
        function selectOption(optionIndex) {
            if (securityViolated) return;
            
            clearInterval(currentQuiz.timer);
            
            const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
            const isCorrect = optionIndex === question.correctAnswer;
            
            // Record the answer
            currentQuiz.answers.push({
                question: question.question,
                selectedOption: optionIndex,
                correctOption: question.correctAnswer,
                isCorrect: isCorrect
            });
            
            // Update score if correct
            if (isCorrect) {
                currentQuiz.score++;
                document.getElementById('current-score').textContent = currentQuiz.score;
            }
            
            // Show feedback
            const options = document.querySelectorAll('.option-btn');
            options.forEach((option, index) => {
                option.disabled = true;
                
                if (index === optionIndex && isCorrect) {
                    option.classList.add('option-correct');
                } else if (index === optionIndex && !isCorrect) {
                    option.classList.add('option-incorrect');
                } else if (index === question.correctAnswer) {
                    option.classList.add('option-correct');
                }
            });
            
            // Wait a moment before loading next question
            setTimeout(() => {
                if (!securityViolated) {
                    currentQuiz.currentQuestionIndex++;
                    loadQuestion();
                }
            }, 1500);
        }

        // End the current quiz
        function endQuiz() {
            if (securityViolated) return;
            
            // Deactivate security measures
            isQuizActive = false;
            isFullscreenLocked = false;
            
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            
            // Save score
            userData.scores[currentQuiz.subjectId] = currentQuiz.score;
            userData.totalScore = calculateTotalScore();
            saveUserData();
            
            // Show results
            showResults();
        }

        // Show quiz results
        function showResults() {
            const subjectName = subjects.find(s => s.id === currentQuiz.subjectId).name;
            document.getElementById('result-subject-name').textContent = subjectName;
            document.getElementById('result-score').textContent = currentQuiz.score;
            
            const percentage = (currentQuiz.score / 20) * 100;
            document.getElementById('result-percentage').textContent = `${percentage.toFixed(1)}% correct`;
            
            let message = '';
            if (percentage >= 90) {
                message = 'Excellent! You\'re a master of this subject!';
            } else if (percentage >= 70) {
                message = 'Great job! You have a solid understanding of this topic!';
            } else if (percentage >= 50) {
                message = 'Good effort! Keep studying to improve your knowledge.';
            } else {
                message = 'Keep practicing! You\'ll improve with more study.';
            }
            document.getElementById('result-message').textContent = message;
            
            // Create results chart
            createResultsChart(currentQuiz.score);
            
            // Generate question review
            generateQuestionReview();
            
            showPage('results-page');
        }

        // Generate question review for results page
        function generateQuestionReview() {
            const container = document.getElementById('question-review');
            container.innerHTML = '';
            
            currentQuiz.answers.forEach((answer, index) => {
                const questionEl = document.createElement('div');
                questionEl.className = 'border-b border-gray-600 pb-3 mb-3';
                
                const statusClass = answer.isCorrect ? 'bg-green-500' : 'bg-red-500';
                const statusText = answer.isCorrect ? 'Correct' : 'Incorrect';
                
                questionEl.innerHTML = `
                    <div class="flex justify-between mb-2">
                        <span class="font-bold">Question ${index + 1}</span>
                        <span class="px-2 py-1 text-xs rounded ${statusClass}">${statusText}</span>
                    </div>
                    <p class="mb-2">${answer.question}</p>
                    <div class="text-sm">
                        ${answer.selectedOption === -1 ? 
                            `<p class="text-yellow-500">Time expired</p>` : 
                            `<p>Your answer: ${currentQuiz.questions[index].options[answer.selectedOption]}</p>`
                        }
                        <p class="text-green-400">Correct answer: ${currentQuiz.questions[index].options[answer.correctOption]}</p>
                    </div>
                `;
                
                container.appendChild(questionEl);
            });
        }

        // Download quiz results
        function downloadResult() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            const subjectName = subjects.find(s => s.id === currentQuiz.subjectId).name;
            const date = new Date().toLocaleDateString();
            
            doc.setFontSize(22);
            doc.text('QUAF-TALENT - Quiz Results', 105, 20, { align: 'center' });
            
            doc.setFontSize(14);
            doc.text(`Subject: ${subjectName}`, 20, 40);
            doc.text(`Date: ${date}`, 20, 50);
            doc.text(`Student: ${userData.username}`, 20, 60);
            doc.text(`Admission No: ${userData.adno}`, 20, 70);
            
            doc.setFontSize(16);
            doc.text(`Score: ${currentQuiz.score} out of 20 (${(currentQuiz.score / 20 * 100).toFixed(1)}%)`, 105, 90, { align: 'center' });
            
            doc.setFontSize(14);
            doc.text('Question Review:', 20, 110);
            
            let yPos = 120;
            currentQuiz.answers.forEach((answer, index) => {
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
                
                const questionText = `Q${index + 1}: ${answer.question}`;
                const wrappedText = doc.splitTextToSize(questionText, 170);
                doc.text(wrappedText, 20, yPos);
                yPos += wrappedText.length * 7;
                
                if (answer.selectedOption === -1) {
                    doc.setTextColor(255, 0, 0);
                    doc.text(`Your answer: Time expired`, 25, yPos);
                } else {
                    doc.setTextColor(answer.isCorrect ? 0 : 255, answer.isCorrect ? 100 : 0, 0);
                    doc.text(`Your answer: ${currentQuiz.questions[index].options[answer.selectedOption]}`, 25, yPos);
                }
                yPos += 7;
                
                doc.setTextColor(0, 100, 0);
                doc.text(`Correct answer: ${currentQuiz.questions[index].options[answer.correctOption]}`, 25, yPos);
                yPos += 15;
                
                doc.setTextColor(0, 0, 0);
            });
            
            doc.save(`quiz-results-${subjectName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
        }

        // Create dashboard chart
        function createDashboardChart(totalScore) {
            const ctx = document.getElementById('dashboard-chart');
            
            if (window.dashboardChart) {
                window.dashboardChart.destroy();
            }
            
            window.dashboardChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Score', 'Remaining'],
                    datasets: [{
                        data: [totalScore, 320 - totalScore],
                        backgroundColor: [
                            '#4299e1',
                            '#1a365d'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const percentage = Math.round((value / 320) * 100);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Create results chart
        function createResultsChart(score) {
            const ctx = document.getElementById('results-chart');
            
            if (window.resultsChart) {
                window.resultsChart.destroy();
            }
            
            window.resultsChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Correct', 'Incorrect'],
                    datasets: [{
                        data: [score, 20 - score],
                        backgroundColor: [
                            '#38a169',
                            '#e53e3e'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#fff',
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const percentage = Math.round((value / 20) * 100);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Update recent activity on dashboard
        function updateRecentActivity() {
            const container = document.getElementById('recent-activity');
            container.innerHTML = '';
            
            const recentSubjects = Object.keys(userData.scores)
                .map(id => ({
                    id,
                    name: subjects.find(s => s.id === id).name,
                    score: userData.scores[id]
                }))
                .sort((a, b) => b.score - a.score)
                .slice(0, 5);
            
            if (recentSubjects.length === 0) {
                container.innerHTML = '<p class="text-gray-300 text-center">No activity yet. Start a quiz to begin!</p>';
                return;
            }
            
            recentSubjects.forEach(subject => {
                const percentage = (subject.score / 20) * 100;
                const activityEl = document.createElement('div');
                activityEl.className = 'flex justify-between items-center bg-primary-light p-3 rounded';
                activityEl.innerHTML = `
                    <div>
                        <span class="font-medium">${subject.name}</span>
                        <div class="text-xs text-gray-300">Score: ${subject.score}/20</div>
                    </div>
                    <div class="w-20 h-20">
                        <div class="w-full h-1 bg-gray-700 rounded-full">
                            <div class="h-full bg-accent rounded-full" style="width: ${percentage}%"></div>
                        </div>
                        <div class="text-xs mt-1 text-right">${percentage}%</div>
                    </div>
                `;
                container.appendChild(activityEl);
            });
        }

        // Calculate total score across all subjects
        function calculateTotalScore() {
            return Object.values(userData.scores || {}).reduce((sum, score) => sum + score, 0);
        }

        // Load user data from localStorage
        function loadUserData() {
            const savedData = localStorage.getItem('quizMasterUserData');
            if (savedData) {
                userData = JSON.parse(savedData);
            }
        }

        // Save user data to localStorage
        function saveUserData() {
            localStorage.setItem('quizMasterUserData', JSON.stringify(userData));
        }

        // Show a specific page and hide others
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active-page');
            });
            
            document.getElementById(pageId).classList.add('active-page');
            
            // Special case for dashboard refresh
            if (pageId === 'dashboard-page') {
                showDashboard();
            }
        }
