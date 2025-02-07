<?php

namespace Infofactory\BardMultipromptAi\Controllers;

use Parsedown;
use EchoLabs\Prism\Prism;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Statamic\Http\Controllers\Controller;
use EchoLabs\Prism\Exceptions\PrismException;
use EchoLabs\Prism\ValueObjects\Messages\UserMessage;

class ActionController extends Controller
{
    public function index()
    {
        $prompts = collect(config('bard-multiprompt-ai.prompts'))
        ->map(function ($prompt) {
            return [
                'id' => $prompt['id'],
                'name' => $prompt['name'],
            ];
        })
        ->toArray();
        return response()->json([
            'data' => $prompts
        ]);
    }

    public function generate(Request $request)
    {

        $validated = $request->validate([
            'prompt_id' => ['required', Rule::in(collect(config('bard-multiprompt-ai.prompts'))->pluck('id')->toArray())],
            'html' => ['required', 'string'],
        ]);

        $prompt = collect(config('bard-multiprompt-ai.prompts'))->where('id', $validated['prompt_id'])->first();

        $messages = [
            new UserMessage($prompt['instructions'])
        ];

        if ($prompt['pass_context']) {
            $messages[] = new UserMessage($validated['html']);
        }

        $response = Prism::text()
            ->using($prompt['provider'], $prompt['model'])
            ->withMessages($messages)
            ->usingTemperature($prompt['temperature'] / 100);
        
        if ($prompt['max_tokens'] !== 0) {
            $response->withMaxTokens($prompt['max_tokens']);
        }
        
        try {
            $response = $response->generate();
        } catch (PrismException $e) {
            return response()->json([
                'data' => [
                    'error' => $e->getMessage()
                ]
            ]);
        }

        // Make sure what we give back is an HTML string
        $parser = new Parsedown();
        $html = $parser->text($response->text);

        return response()->json(
            ['data' => [
                'html' => $html,
                'generation_mode' => $prompt['generation_mode']
            ]]
        );
    }
}
