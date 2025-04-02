<?php

namespace Infofactory\BardMultipromptAi\Controllers;

use Parsedown;
use Prism\Prism\Prism;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Statamic\Http\Controllers\Controller;
use Prism\Prism\Exceptions\PrismException;
use Prism\Prism\ValueObjects\Messages\UserMessage;
use Infofactory\BardMultipromptAi\Services\TemplateService;

class ActionController extends Controller
{
    public function index()
    {
        $prompts = collect(config('bard-multiprompt-ai.prompts'))
        ->map(function ($prompt) {
            return [
                'id' => $prompt['id'],
                'name' => $prompt['name'],
                'variables' => TemplateService::extractVariables($prompt['instructions'])
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
            'variables' => ['sometimes', 'array'],
        ]);

        $prompt = collect(config('bard-multiprompt-ai.prompts'))->where('id', $validated['prompt_id'])->first();

        $messages = [
            new UserMessage(TemplateService::renderTemplate($prompt['instructions'], $validated['variables']))
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
            $response = $response->asText();
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
