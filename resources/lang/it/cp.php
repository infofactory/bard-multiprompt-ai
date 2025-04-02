<?php

return [
    'title' => 'Prompt AI',
    'button' => 'AI Tools',
    'list' => [
        'title' => 'Lista dei prompt',
        'instructions' => 'Qui puoi aggiungere i tuoi prompt per l\'editor Bard',
        'new' => 'Nuovo prompt'
    ],
    'generate' => 'Genera',
    'generating' => 'Sto generando',
    'cancel' => 'Annulla',
    'item' => [
        'title' => 'Prompt',
        'name' => [
            'display' => 'Nome',
            'instructions' => 'Verrà usato nel menu Bard',
            'placeholder' => 'La mia nuova feature...',
        ],
        'provider' => [
            'display' => 'Provider',
            'instructions' => 'Puoi abilitare i provider modificando il tuo .env',
            'placeholder' => 'Nessun provider',
        ],
        'model' => [
            'display' => 'Modello',
            'instructions' => 'Il nome del modello per il provider che hai selezionato',
            'placeholder' => 'gpt-4o-mini',
        ],
        'instructions' => [
            'display' => 'Istruzioni',
            'instructions' => 'Qui puoi scrivere cosa vuoi che l\'AI faccia',
            'placeholder' => 'Riscrivi questo testo in lingua pirata e ...',
        ],
        'pass_context' => [
            'display' => 'Ha bisogno di contesto?',
            'instructions' => 'Passa la selezione corrente o tutto il testo all\'AI',
        ],
        'generation_mode' => [
            'display' => 'Come vuoi integrare il testo?',
            'options' => [
                'replace' => 'Sostituisci',
                'continue' => 'Continua',
            ],
        ],
        'max_tokens' => [
            'display' => 'Quanto dovrebbe scrivere?',
            'instructions' => 'Un token è circa 4 caratteri. Usa 0 per rimuovere il limite.',
        ],
        'temperature' => [
            'display' => 'Quanto creativo dovrebbe essere?',
            'instructions' => 'Dove 0 sono risposte prevedibili (buone per le traduzioni) e 100 sono creative (buone per inventare cose)',
        ]
    ]
];
