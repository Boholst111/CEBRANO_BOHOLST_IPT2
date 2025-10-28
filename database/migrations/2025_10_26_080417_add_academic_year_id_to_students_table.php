<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddAcademicYearIdToStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('students', function (Blueprint $table) {
            $table->unsignedBigInteger('academic_year_id')->nullable()->after('department_id');
        });

        // Migrate data
        DB::statement("
            UPDATE students 
            SET academic_year_id = (
                SELECT id FROM academic_years 
                WHERE name LIKE CONCAT(academic_year, '-%') 
                LIMIT 1
            ) 
            WHERE academic_year IS NOT NULL
        ");

        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn('academic_year');
        });
    }

    public function down()
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('academic_year')->nullable()->after('department_id');
        });

        // Reverse data migration
        DB::statement("
            UPDATE students 
            SET academic_year = (
                SELECT start_year FROM academic_years 
                WHERE id = academic_year_id
            ) 
            WHERE academic_year_id IS NOT NULL
        ");

        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn('academic_year_id');
        });
    }
}
