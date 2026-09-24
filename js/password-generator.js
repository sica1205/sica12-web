(() => {

    let initializedRoot = null;


    function initPasswordGenerator() {

        const root =
            document.querySelector(
                ".password-generator"
            );


        if (
            !root ||
            initializedRoot === root
        ) {
            return;
        }


        initializedRoot =
            root;


        const output =
            root.querySelector(
                "#password-output"
            );


        const lengthSlider =
            root.querySelector(
                "#password-length"
            );


        const lengthValue =
            root.querySelector(
                "#password-length-value"
            );


        const lowercase =
            root.querySelector(
                "#password-lowercase"
            );


        const uppercase =
            root.querySelector(
                "#password-uppercase"
            );


        const numbers =
            root.querySelector(
                "#password-numbers"
            );


        const symbols =
            root.querySelector(
                "#password-symbols"
            );


        const ambiguous =
            root.querySelector(
                "#password-ambiguous"
            );


        const generateButton =
            root.querySelector(
                "#password-generate"
            );


        const copyButton =
            root.querySelector(
                "#password-copy"
            );


        const strengthFill =
            root.querySelector(
                "#password-strength-fill"
            );


        const strengthText =
            root.querySelector(
                "#password-strength-text"
            );


        const entropyOutput =
            root.querySelector(
                "#password-entropy"
            );


        const poolOutput =
            root.querySelector(
                "#password-pool"
            );


        const toast =
            root.querySelector(
                "#password-toast"
            );


        if (
            !output ||
            !lengthSlider ||
            !lengthValue ||
            !lowercase ||
            !uppercase ||
            !numbers ||
            !symbols ||
            !ambiguous ||
            !generateButton ||
            !copyButton ||
            !strengthFill ||
            !strengthText ||
            !entropyOutput ||
            !poolOutput ||
            !toast
        ) {
            return;
        }



        // ==========================================
        // CHARACTER SETS
        // ==========================================

        const SETS = {

            lowercase:
                "abcdefghijklmnopqrstuvwxyz",

            uppercase:
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ",

            numbers:
                "0123456789",

            symbols:
                "!@#$%^&*()_+-=[]{};:,.<>?"

        };


        const AMBIGUOUS =
            "0Oo1lI";


        let toastTimer = null;



        // ==========================================
        // SECURE RANDOM
        // ==========================================

        function secureRandomInt(max) {

            if (max <= 0) {
                return 0;
            }


            const cryptoObject =
                window.crypto ||
                window.msCrypto;


            if (!cryptoObject) {

                return Math.floor(
                    Math.random() * max
                );

            }


            const limit =
                Math.floor(
                    0x100000000 / max
                ) * max;


            const array =
                new Uint32Array(1);


            let value;


            do {

                cryptoObject.getRandomValues(
                    array
                );

                value =
                    array[0];

            }
            while (value >= limit);


            return value % max;

        }



        // ==========================================
        // ACTIVE POOL
        // ==========================================

        function getActiveSets() {

            const sets = [];


            if (lowercase.checked) {
                sets.push(
                    SETS.lowercase
                );
            }


            if (uppercase.checked) {
                sets.push(
                    SETS.uppercase
                );
            }


            if (numbers.checked) {
                sets.push(
                    SETS.numbers
                );
            }


            if (symbols.checked) {
                sets.push(
                    SETS.symbols
                );
            }


            if (ambiguous.checked) {

                return sets.map(set =>

                    [...set]
                        .filter(
                            char =>
                                !AMBIGUOUS.includes(
                                    char
                                )
                        )
                        .join("")

                );

            }


            return sets;

        }



        // ==========================================
        // SHUFFLE
        // ==========================================

        function shuffle(array) {

            for (
                let i =
                    array.length - 1;

                i > 0;

                i--
            ) {

                const j =
                    secureRandomInt(
                        i + 1
                    );


                [
                    array[i],
                    array[j]
                ] =
                    [
                        array[j],
                        array[i]
                    ];

            }


            return array;

        }



        // ==========================================
        // GENERATE
        // ==========================================

        function generatePassword() {

            const sets =
                getActiveSets();


            /*
              Nu permitem zero categorii.
            */

            if (sets.length === 0) {

                lowercase.checked =
                    true;


                return generatePassword();

            }


            const length =
                Number(
                    lengthSlider.value
                );


            const pool =
                sets.join("");


            const chars = [];


            /*
              Garantăm minimum un caracter
              din fiecare categorie activă.
            */

            sets.forEach(set => {

                if (!set.length) {
                    return;
                }


                chars.push(

                    set[
                    secureRandomInt(
                        set.length
                    )
                    ]

                );

            });


            while (
                chars.length < length
            ) {

                chars.push(

                    pool[
                    secureRandomInt(
                        pool.length
                    )
                    ]

                );

            }


            shuffle(chars);


            const password =
                chars
                    .slice(0, length)
                    .join("");


            output.value =
                password;


            updateStrength(
                length,
                pool.length
            );

        }



        // ==========================================
        // STRENGTH
        // ==========================================

        function updateStrength(
            length,
            poolSize
        ) {

            const entropy =
                length *
                Math.log2(
                    Math.max(
                        poolSize,
                        1
                    )
                );


            entropyOutput.textContent =
                `~${Math.round(entropy)} bits`;


            poolOutput.textContent =
                `${poolSize} possible chars`;


            let percent;
            let label;


            if (entropy < 35) {

                percent = 20;

                label =
                    "WEAK";

            }

            else if (entropy < 55) {

                percent = 40;

                label =
                    "DECENT";

            }

            else if (entropy < 80) {

                percent = 65;

                label =
                    "STRONG";

            }

            else if (entropy < 120) {

                percent = 85;

                label =
                    "VERY STRONG";

            }

            else {

                percent = 100;

                label =
                    "ABSURD";

            }


            strengthFill.style.width =
                `${percent}%`;


            strengthText.textContent =
                label;

        }



        // ==========================================
        // LENGTH
        // ==========================================

        lengthSlider.addEventListener(
            "input",
            () => {

                lengthValue.textContent =
                    lengthSlider.value;


                generatePassword();

            }
        );



        // ==========================================
        // OPTIONS
        // ==========================================

        const optionInputs = [

            lowercase,
            uppercase,
            numbers,
            symbols,
            ambiguous

        ];


        optionInputs.forEach(
            checkbox => {

                checkbox.addEventListener(
                    "change",
                    () => {


                        const enabledCount = [

                            lowercase,
                            uppercase,
                            numbers,
                            symbols

                        ].filter(
                            item =>
                                item.checked
                        ).length;


                        /*
                          Dacă tocmai ai dezactivat
                          ultima categorie,
                          o pornim iar.
                        */

                        if (
                            enabledCount === 0
                        ) {

                            checkbox.checked =
                                true;


                            showToast(
                                "NEED AT LEAST ONE SET"
                            );

                        }


                        generatePassword();

                    }
                );

            }
        );



        // ==========================================
        // GENERATE BUTTON
        // ==========================================

        generateButton.addEventListener(
            "click",
            () => {

                generatePassword();

            }
        );



        // ==========================================
        // COPY
        // ==========================================

        async function copyPassword() {

            const password =
                output.value;


            if (!password) {
                return;
            }


            try {

                await navigator
                    .clipboard
                    .writeText(
                        password
                    );


                showToast(
                    "PASSWORD COPIED"
                );

            }

            catch {

                output.select();


                document.execCommand(
                    "copy"
                );


                window
                    .getSelection()
                    ?.removeAllRanges();


                showToast(
                    "PASSWORD COPIED"
                );

            }

        }


        copyButton.addEventListener(
            "click",
            copyPassword
        );



        // ==========================================
        // TOAST
        // ==========================================

        function showToast(
            message
        ) {

            toast.textContent =
                message;


            toast.classList.add(
                "show"
            );


            clearTimeout(
                toastTimer
            );


            toastTimer =
                setTimeout(
                    () => {

                        toast.classList.remove(
                            "show"
                        );

                    },
                    1300
                );

        }



        // ==========================================
        // INIT
        // ==========================================

        lengthValue.textContent =
            lengthSlider.value;


        generatePassword();

    }



    // ==========================================================
    // MODULE WATCHER
    // ==========================================================

    const observer =
        new MutationObserver(
            () => {

                const root =
                    document.querySelector(
                        ".password-generator"
                    );


                if (root) {

                    initPasswordGenerator();

                }

                else {

                    initializedRoot =
                        null;

                }

            }
        );



    function start() {

        observer.observe(
            document.body,
            {
                childList: true,
                subtree: true
            }
        );


        initPasswordGenerator();

    }



    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            start,
            {
                once: true
            }
        );

    }

    else {

        start();

    }

})();