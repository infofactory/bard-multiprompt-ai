@extends('statamic::layout')

@section('title', __('bard-multiprompt-ai::cp.title'))

@section('content')
    <publish-form
        title='{{ __('bard-multiprompt-ai::cp.title') }}'
        action={{ cp_route('bard-multiprompt-ai.config') }}
        :blueprint='@json($blueprint)'
        :meta='@json($meta)'
        :values='@json($values)'
    ></publish-form>
@stop
