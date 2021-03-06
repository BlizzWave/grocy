@extends('layout.default')

@section('title', $L('Habits overview'))
@section('activeNav', 'habitsoverview')
@section('viewJsName', 'habitsoverview')

@push('pageScripts')
	<script src="{{ $U('/node_modules/jquery-ui-dist/jquery-ui.min.js?v=', true) }}{{ $version }}"></script>
@endpush

@section('content')
<div class="row">
	<div class="col">
		<h1>@yield('title')</h1>
		<p class="btn btn-lg btn-warning no-real-button responsive-button mr-2">{{ $L('#1 habits are due to be done within the next #2 days', $countDueNextXDays, $nextXDays) }}</p>
		<p class="btn btn-lg btn-danger no-real-button responsive-button">{{ $L('#1 habits are overdue to be done', $countOverdue) }}</p>
	</div>
</div>

<div class="row mt-3">
	<div class="col-xs-12 col-md-6 col-xl-3">
		<label for="search">{{ $L('Search') }}</label> <i class="fas fa-search"></i>
		<input type="text" class="form-control" id="search">
	</div>
</div>

<div class="row">
	<div class="col">
		<table id="habits-overview-table" class="table table-sm table-striped dt-responsive">
			<thead>
				<tr>
					<th>#</th>
					<th>{{ $L('Habit') }}</th>
					<th>{{ $L('Next estimated tracking') }}</th>
					<th>{{ $L('Last tracked') }}</th>
				</tr>
			</thead>
			<tbody>
				@foreach($currentHabits as $curentHabitEntry)
				<tr class="@if(FindObjectInArrayByPropertyValue($habits, 'id', $curentHabitEntry->habit_id)->period_type === \Grocy\Services\HabitsService::HABIT_TYPE_DYNAMIC_REGULAR && $nextHabitTimes[$curentHabitEntry->habit_id] < date('Y-m-d H:i:s')) table-danger @endif">
					<td class="fit-content">
						<a class="btn btn-success btn-sm track-habit-button" href="#" title="{{ $L('Track execution of habit #1', FindObjectInArrayByPropertyValue($habits, 'id', $curentHabitEntry->habit_id)->name) }}"
							data-habit-id="{{ $curentHabitEntry->habit_id }}"
							data-habit-name="{{ FindObjectInArrayByPropertyValue($habits, 'id', $curentHabitEntry->habit_id)->name }}">
							<i class="fas fa-play"></i>
						</a>
					</td>
					<td>
						{{ FindObjectInArrayByPropertyValue($habits, 'id', $curentHabitEntry->habit_id)->name }}
					</td>
					<td>
						@if(FindObjectInArrayByPropertyValue($habits, 'id', $curentHabitEntry->habit_id)->period_type === \Grocy\Services\HabitsService::HABIT_TYPE_DYNAMIC_REGULAR)
							{{ $nextHabitTimes[$curentHabitEntry->habit_id] }}
							<time class="timeago timeago-contextual" datetime="{{ $nextHabitTimes[$curentHabitEntry->habit_id] }}"></time>
						@else
							...
						@endif
					</td>
					<td>
						<span id="habit-{{ $curentHabitEntry->habit_id }}-last-tracked-time">{{ $curentHabitEntry->last_tracked_time }}</span>
						<time id="habit-{{ $curentHabitEntry->habit_id }}-last-tracked-time-timeago" class="timeago timeago-contextual" datetime="{{ $curentHabitEntry->last_tracked_time }}"></time>
					</td>
				</tr>
				@endforeach
			</tbody>
		</table>
	</div>
</div>
@stop
