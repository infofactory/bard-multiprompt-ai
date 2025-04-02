<?php

return [
    'title' => 'AI prompts',
    'button' => 'AI Tools',
    'list' => [
        'title' => 'Prompt List',
        'instructions' => 'Here you can add your own prompts to use in the Bard editor',
        'new' => 'New Prompt'
    ],
    'generate' => 'Generate',
    'generating' => 'Generating',
    'cancel' => 'Cancel',
    'item' => [
        'title' => 'Prompt',
        'name' => [
            'display' => 'Name',
            'instructions' => 'This will be used in the Bard menu',
            'placeholder' => 'My new feature...',
        ],
        'provider' => [
            'display' => 'Provider',
            'instructions' => 'You can enable providers by modifying your .env',
            'placeholder' => 'No provider',
        ],
        'model' => [
            'display' => 'Model',
            'instructions' => 'The name of the model for the provider you selected',
            'placeholder' => 'gpt-4o-mini',
        ],
        'instructions' => [
            'display' => 'Instructions',
            'instructions' => 'Here you can specify what you want it to do',
            'placeholder' => 'Rewrite this text in pirate speach and ...',
        ],
        'pass_context' => [
            'display' => 'Does it need context?',
            'instructions' => 'Pass the current selection or the whole document to the AI',
        ],
        'generation_mode' => [
            'display' => 'How to integrate the text?',
            'options' => [
                'replace' => 'Replace text',
                'continue' => 'Continue',
            ],
        ],
        'max_tokens' => [
            'display' => 'How much should it write?',
            'instructions' => 'One token is aprox. 4 characters. Set to 0 to remove the limit.',
        ],
        'temperature' => [
            'display' => 'How creative should it be?',
            'instructions' => 'Where 0 is predictable answers (good for translations) and 100 is creative (good for inventing stuff)',
        ]
    ]
];
